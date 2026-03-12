function VendorDashboard() {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "18px" }}>
        <h2>Dashboard</h2>
        <div>Home</div>
      </div>

      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(15,23,42,0.05)",
        }}
      >
        Welcome to RFP System.
      </div>
    </div>
  );
}

export default VendorDashboard;