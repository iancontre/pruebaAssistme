# Configuración de Stripe para el Wizard de Pago

## Descripción
Este documento explica cómo configurar el backend para integrar Stripe Checkout con el wizard de pago.

## Endpoints del Backend Necesarios

### 1. Crear Checkout Session
**Endpoint:** `POST /api/create-checkout-session`

**Request Body:**
```json
{
  "planId": "starter",
  "planName": "STARTER",
  "amount": 82.16,
  "taxAmount": 3.16,
  "customerEmail": "customer@example.com",
  "customerName": "John Doe",
  "state": "California",
  "successUrl": "https://yourdomain.com/compra?success=true&session_id={CHECKOUT_SESSION_ID}",
  "cancelUrl": "https://yourdomain.com/compra?canceled=true"
}
```

**Response:**
```json
{
  "id": "cs_test_...",
  "url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

### 2. Generar Factura
**Endpoint:** `POST /api/generate-invoice`

**Request Body:**
```json
{
  "sessionId": "cs_test_..."
}
```

**Response:**
```json
{
  "invoiceNumber": "INV-2024-001",
  "downloadUrl": "https://yourdomain.com/invoices/INV-2024-001.pdf",
  "amount": 82.16,
  "taxAmount": 3.16,
  "total": 85.32
}
```

## Implementación del Backend (Node.js/Express)

### Instalación de Dependencias
```bash
npm install stripe express cors
```

### Configuración Básica
```javascript
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Crear Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const {
      planId,
      planName,
      amount,
      taxAmount,
      customerEmail,
      customerName,
      state,
      successUrl,
      cancelUrl
    } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: planName,
              description: `Monthly subscription for ${planName} plan`,
            },
            unit_amount: Math.round(amount * 100), // Stripe usa centavos
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Sales Tax',
              description: `Sales tax for ${state}`,
            },
            unit_amount: Math.round(taxAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      metadata: {
        planId,
        customerName,
        state,
        taxAmount: taxAmount.toString(),
      },
    });

    res.json({
      id: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Generar Factura
app.post('/api/generate-invoice', async (req, res) => {
  try {
    const { sessionId } = req.body;

    // Recuperar la sesión de Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    // Aquí puedes implementar tu lógica para generar la factura
    // Por ejemplo, crear un PDF, guardar en base de datos, etc.
    
    const invoiceNumber = `INV-${Date.now()}`;
    const downloadUrl = `https://yourdomain.com/invoices/${invoiceNumber}.pdf`;

    res.json({
      invoiceNumber,
      downloadUrl,
      amount: session.amount_total / 100,
      taxAmount: parseFloat(session.metadata.taxAmount || '0'),
      total: session.amount_total / 100,
    });
  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(500).json({ error: 'Failed to generate invoice' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Variables de Entorno
```env
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

## Configuración en el Frontend

### Actualizar la Clave Pública
En `src/services/stripeService.ts`, actualiza la clave pública:
```typescript
const STRIPE_PUBLISHABLE_KEY = 'pk_test_your_actual_stripe_publishable_key_here';
```

### URLs de Desarrollo
Para desarrollo local, asegúrate de que las URLs de éxito y cancelación apunten a tu aplicación:
```typescript
successUrl: `${window.location.origin}/compra?success=true&session_id={CHECKOUT_SESSION_ID}`,
cancelUrl: `${window.location.origin}/compra?canceled=true`,
```

## Flujo de Pago

1. **Usuario selecciona plan** en el tercer paso del wizard
2. **Se calcula el impuesto** basado en el estado seleccionado
3. **Se crea una Checkout Session** en Stripe con los detalles del plan e impuestos
4. **Usuario es redirigido** a la página de pago de Stripe
5. **Después del pago exitoso**, Stripe redirige de vuelta a la aplicación
6. **Se genera la factura** automáticamente
7. **Usuario ve la confirmación** en el paso final del wizard

## Consideraciones de Seguridad

- **Nunca expongas la clave secreta** en el frontend
- **Valida todos los datos** en el backend antes de crear la sesión
- **Usa HTTPS** en producción
- **Implementa webhooks** para manejar eventos de pago de forma asíncrona
- **Guarda los datos de pago** en tu base de datos para auditoría

## Webhooks (Opcional pero Recomendado)

Para manejar eventos de pago de forma más robusta, implementa webhooks:

```javascript
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // Manejar pago exitoso
      console.log('Payment successful:', session.id);
      break;
    case 'invoice.payment_succeeded':
      const invoice = event.data.object;
      // Manejar factura pagada
      console.log('Invoice paid:', invoice.id);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});
```

## Pruebas

1. **Usa tarjetas de prueba** de Stripe para desarrollo
2. **Prueba diferentes escenarios**: pago exitoso, cancelación, errores
3. **Verifica el cálculo de impuestos** con diferentes estados
4. **Prueba la generación de facturas**
5. **Verifica la redirección** después del pago 