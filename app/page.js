export default function Home() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
      color: "white",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center"
    }}>
      <h1 style={{fontSize: "3rem", fontWeight: "bold"}}>
        📚 Surendra Book Store
      </h1>
      <p style={{marginTop: "20px", fontSize: "1.2rem"}}>
        Modern Online Book Shopping Experience
      </p>
      <button style={{
        marginTop: "30px",
        padding: "12px 24px",
        backgroundColor: "#ff6b6b",
        border: "none",
        borderRadius: "8px",
        fontSize: "1rem",
        cursor: "pointer"
      }}>
        Shop Now
      </button>
    </div>
  );
}
