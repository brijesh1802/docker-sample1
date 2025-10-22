import { useEffect, useState, useCallback } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });

  // Fetch all users
  const loadUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) {
        console.error("Failed to fetch users:", res.status);
        return;
      }
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      // Try to read JSON, but don’t fail if it’s empty
      if (res.ok) {
        try {
          await res.json();
        } catch {
          // ignore if response body is empty
        }
        await loadUsers(); // Refresh the list
        setForm({ name: "", email: "" });
      } else {
        console.error("Failed to add user:", res.status);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  const initials = (name) =>
    (name || "")
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <div className="app-root">
      <style>{`
        :root{
          --bg1: #0b1220; /* deep navy */
          --bg2: #10202a; /* slightly tealish navy */
          --glass: rgba(255,255,255,0.04);
          --accent-start: #ff7a59; /* warm coral */
          --accent-end: #ffcc70; /* golden */
          --muted: rgba(255,255,255,0.8);
          --card-shadow: 0 6px 20px rgba(8,12,20,0.6);
        }
        *{box-sizing:border-box}
        body, #root { height: 100%; margin: 0; font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; }
        .app-root{
          min-height:100vh;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:48px 20px;
          background: radial-gradient(1200px 600px at 10% 10%, rgba(255,122,89,0.08), transparent 8%),
                      radial-gradient(800px 400px at 90% 90%, rgba(255,204,112,0.06), transparent 8%),
                      linear-gradient(180deg, var(--bg1), var(--bg2));
        }

        /* Fixed-size card so content area is consistent */
        .card{
          width:100%;
          max-width:920px;
          height:520px; /* fixed length as requested */
          background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
          border-radius:16px;
          padding:28px;
          box-shadow: var(--card-shadow);
          border: 1px solid rgba(255,255,255,0.03);
          backdrop-filter: blur(6px) saturate(120%);
          display:grid;
          grid-template-columns: 1fr 360px;
          gap:24px;
          align-items:start;
          overflow: hidden; /* keep layout tidy */
        }

        .header{
          display:flex;
          align-items:center;
          gap:16px;
          margin-bottom:8px;
        }
        .logo {
          width:56px;
          height:56px;
          border-radius:12px;
          background: linear-gradient(135deg, var(--accent-start), var(--accent-end));
          display:flex;
          align-items:center;
          justify-content:center;
          color:white;
          font-weight:700;
          font-size:20px;
          box-shadow: 0 6px 18px rgba(7,10,38,0.6);
        }
        h1{
          margin:0;
          color:white;
          font-size:18px;
        }
        p.lead{
          margin:6px 0 18px 0;
          color: var(--muted);
          font-size:13px;
        }

        /* Form */
        form{
          display:flex;
          gap:12px;
          align-items:center;
          flex-wrap:wrap;
        }
        .inputs{
          display:flex;
          gap:12px;
          flex:1 1 auto;
        }
        input{
          flex:1 1 auto;
          min-width:0;
          padding:12px 14px;
          border-radius:10px;
          border:1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
          color:white;
          outline:none;
          font-size:14px;
          transition: box-shadow .15s, transform .08s, border-color .15s;
        }
        input:focus{
          box-shadow: 0 6px 18px rgba(255,122,89,0.12);
          border-color: rgba(255,122,89,0.6);
          transform: translateY(-1px);
        }
        .btn{
          white-space:nowrap;
          padding:10px 14px;
          border-radius:10px;
          border:none;
          cursor:pointer;
          color:white;
          background: linear-gradient(90deg, var(--accent-start), var(--accent-end));
          box-shadow: 0 8px 24px rgba(12,8,44,0.5);
          font-weight:600;
          transition: transform .12s, opacity .12s;
        }
        .btn:hover{ transform: translateY(-2px); }
        .btn:active{ transform: translateY(0); }

        /* Right column */
        .sidebar{
          background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
          border-radius:12px;
          padding:16px;
          border: 1px solid rgba(255,255,255,0.03);
          min-height: 160px;
          height: 100%;
        }
        .stats{
          display:flex;
          gap:12px;
          align-items:center;
          margin-bottom:14px;
        }
        .stat{
          flex:1;
          background: rgba(255,255,255,0.02);
          padding:10px;
          border-radius:10px;
          text-align:center;
        }
        .stat .num{ color:white; font-weight:700; font-size:16px; }
        .stat .label{ color:var(--muted); font-size:12px; margin-top:4px; }

        /* Users list */
        .users{
          margin-top:6px;
        }
        /* limit visible area to ~4 items and enable scrolling when more items exist */
        ul.user-list{
          list-style:none;
          padding:8px 0 0 0;
          margin:0;
          display:flex;
          flex-direction:column;
          gap:10px;
          max-height: calc((56px + 10px) * 4); /* approx item height + gap times 4 */
          overflow: auto;
          padding-right: 8px; /* space for scrollbar */
        }
        /* nice thin scrollbar */
        ul.user-list::-webkit-scrollbar{ width:8px; }
        ul.user-list::-webkit-scrollbar-thumb{ background: rgba(255,255,255,0.06); border-radius:8px; }
        ul.user-list::-webkit-scrollbar-track{ background: transparent; }

        li.user{
          display:flex;
          gap:12px;
          align-items:center;
          padding:10px 12px;
          border-radius:10px;
          background: linear-gradient(180deg, rgba(255,255,255,0.01), transparent);
          border: 1px solid rgba(255,255,255,0.02);
          transition: transform .12s, box-shadow .12s;
          min-height:56px;
        }
        li.user:hover{
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(8,12,20,0.5);
        }
        .avatar{
          width:44px;
          height:44px;
          border-radius:10px;
          display:flex;
          align-items:center;
          justify-content:center;
          font-weight:700;
          color:white;
          background: linear-gradient(135deg, rgba(255,122,89,0.9), rgba(255,204,112,0.9));
          flex-shrink:0;
          font-size:14px;
        }
        .meta .name{ color:white; font-weight:600; font-size:14px; }
        .meta .email{ color:var(--muted); font-size:13px; margin-top:2px; }

        /* Empty state */
        .empty{
          color:var(--muted);
          padding:14px;
          border-radius:10px;
          background: rgba(255,255,255,0.01);
          border:1px dashed rgba(255,255,255,0.02);
        }

        /* Responsive */
        @media (max-width: 880px){
          .card{ grid-template-columns: 1fr; height: auto; } /* allow height to grow on small screens */
          .sidebar{ order: -1; }
          ul.user-list{ max-height: calc((56px + 10px) * 4); } /* keep same limit */
        }
      `}</style>

      <div className="card" role="main">
        <div>
          <div className="header">
            <div className="logo">FS</div>
            <div>
              <h1>Sample App 1 — Users</h1>
              <p className="lead">A small modern UI for adding and listing users.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} aria-label="Add user form">
            <div className="inputs">
              <input
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                aria-label="Name"
              />
              <input
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                aria-label="Email"
              />
            </div>
            <button type="submit" className="btn" aria-label="Add user">
              ➕ Add
            </button>
          </form>

          <div style={{ marginTop: 20 }}>
            {users.length === 0 ? (
              <div className="empty">No users yet. Add the first user using the form above.</div>
            ) : (
              <div className="users">
                <ul className="user-list" aria-live="polite">
                  {users.map((u) => (
                    <li className="user" key={u.id}>
                      <div
                        className="avatar"
                        style={{
                          background:
                            `linear-gradient(135deg, rgba(255,122,89,0.9), rgba(255,204,112,0.9))`,
                        }}
                        aria-hidden
                      >
                        {initials(u.name)}
                      </div>
                      <div className="meta">
                        <div className="name">{u.name}</div>
                        <div className="email">{u.email}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <aside className="sidebar" aria-label="Overview">
          <div className="stats" role="status">
            <div className="stat">
              <div className="num">{users.length}</div>
              <div className="label">Total users</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;
