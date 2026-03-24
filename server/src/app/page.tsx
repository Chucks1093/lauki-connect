export default function HomePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        margin: 0,
        padding: '2rem',
        background:
          'radial-gradient(circle at top, #fff7f2 0%, #f8f5ef 38%, #f1ede7 100%)',
        color: '#161616',
      }}
    >
      <section
        style={{
          width: 'min(42rem, 100%)',
          background: 'rgba(255, 255, 255, 0.88)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          borderRadius: '1.5rem',
          padding: '2rem',
        }}
      >
        <p
          style={{
            margin: '0 0 0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            fontSize: '0.75rem',
            color: '#ff5c16',
          }}
        >
          Lauki Connect
        </p>
        <h1 style={{ margin: '0 0 0.75rem' }}>Next server scaffold is ready.</h1>
        <p style={{ margin: 0, lineHeight: 1.6, color: '#4a4a4a' }}>
          This server now owns auth, profile search, saved profiles, and Supabase access for the
          app.
        </p>
      </section>
    </main>
  );
}
