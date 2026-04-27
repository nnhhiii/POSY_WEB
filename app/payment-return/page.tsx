'use client';

import { useSearchParams, useRouter } from 'next/navigation';

export default function PaymentReturnPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get('orderId');
  const status = searchParams.get('status');

  const isSuccess = status === 'success';

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.iconBox(isSuccess)}>
          {isSuccess ? '✓' : '✕'}
        </div>

        <h1 style={styles.title(isSuccess)}>
          {isSuccess ? 'Payment Successful' : 'Payment Failed'}
        </h1>

        <p style={styles.subtitle}>
          {isSuccess
            ? 'Your payment has been processed successfully'
            : 'Something went wrong with your payment'}
        </p>

        <div style={styles.infoBox}>
          <div style={styles.row}>
            <span>Order ID</span>
            <b>{orderId}</b>
          </div>

          <div style={styles.row}>
            <span>Status</span>
            <b style={{ color: isSuccess ? '#16a34a' : '#dc2626' }}>
              {status}
            </b>
          </div>
        </div>

        <button
          style={styles.button(isSuccess)}
          onClick={() => router.push(`/orders/${orderId}`)}
        >
          View Order Detail
        </button>

        <button
          style={styles.secondaryBtn}
          onClick={() => router.push('/')}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

const styles: any = {
  wrapper: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg,#f5f7fa,#e4ecfb)',
    padding: 16,
  },

  card: {
    width: '100%',
    maxWidth: 420,
    background: 'white',
    borderRadius: 16,
    padding: 28,
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
  },

  iconBox: (success: boolean) => ({
    width: 70,
    height: 70,
    borderRadius: '50%',
    margin: '0 auto 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    background: success
      ? 'linear-gradient(135deg,#22c55e,#16a34a)'
      : 'linear-gradient(135deg,#ef4444,#dc2626)',
  }),

  title: (success: boolean) => ({
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 6,
    color: success ? '#16a34a' : '#dc2626',
  }),

  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
  },

  infoBox: {
    background: '#f9fafb',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },

  row: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '6px 0',
    fontSize: 14,
    color: '#374151',
  },

  button: (success: boolean) => ({
    width: '100%',
    padding: '12px',
    borderRadius: 10,
    border: 'none',
    cursor: 'pointer',
    fontWeight: 600,
    color: 'white',
    marginBottom: 10,
    background: success
      ? 'linear-gradient(135deg,#16a34a,#22c55e)'
      : 'linear-gradient(135deg,#dc2626,#ef4444)',
  }),

  secondaryBtn: {
    width: '100%',
    padding: '12px',
    borderRadius: 10,
    border: '1px solid #e5e7eb',
    background: 'white',
    cursor: 'pointer',
    fontWeight: 500,
    color: '#374151',
  },
};