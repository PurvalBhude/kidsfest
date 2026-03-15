import { Loader2 } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', background: '#f5f3ee', gap: '0.75rem' }}>
      <Loader2 style={{ width: 40, height: 40, color: '#e63228' }} className="animate-spin" />
      <p style={{ fontFamily: 'Signika, sans-serif', color: '#888', fontSize: '0.9rem' }}>Loading...</p>
    </div>
  );
}
