import { useState } from "react";
import AdminDashboard from "../components/admin/AdminDashboard";
import OrdersManagement from "../components/admin/OrdersManagement";
import MenuManagement from "../components/admin/MenuManagement";
import CustomersPage from "../components/admin/CustomersPage";
import ReviewsPage from "../components/admin/ReviewsPage";
import LoyaltyPage from "../components/admin/LoyaltyPage";
import EmployeesPage from "../components/admin/EmployeesPage";
import InventoryPage from "../components/admin/InventoryPage";
import SuppliersPage from "../components/admin/SuppliersPage";
import FinancePage from "../components/admin/FinancePage";
import ReportsPage from "../components/admin/ReportsPage";

const navGroups = [
  {
    label: "Overview",
    items: [
      { key: "dashboard", label: "Dashboard",  icon: "bi-grid-1x2-fill"     },
      { key: "orders",    label: "Orders",      icon: "bi-bag-check-fill",  badge: "8" },
      { key: "menu",      label: "Menu",        icon: "bi-journal-richtext"  },
    ],
  },
  {
    label: "Customers",
    items: [
      { key: "customers", label: "Customers",  icon: "bi-people-fill"       },
      { key: "reviews",   label: "Reviews",    icon: "bi-star-fill"         },
      { key: "loyalty",   label: "Loyalty",    icon: "bi-gem"               },
    ],
  },
  {
    label: "Operations",
    items: [
      { key: "employees", label: "Employees",  icon: "bi-person-badge-fill" },
      { key: "inventory", label: "Inventory",  icon: "bi-boxes"             },
      { key: "suppliers", label: "Suppliers",  icon: "bi-truck"             },
    ],
  },
  {
    label: "Finance",
    items: [
      { key: "finance",   label: "Finance",    icon: "bi-cash-stack"        },
      { key: "reports",   label: "Reports",    icon: "bi-bar-chart-fill"    },
    ],
  },
];

const pageMap = {
  dashboard: { title: "Dashboard",           component: AdminDashboard   },
  orders:    { title: "Orders Management",   component: OrdersManagement },
  menu:      { title: "Menu Management",     component: MenuManagement   },
  customers: { title: "Customers",           component: CustomersPage    },
  reviews:   { title: "Customer Reviews",    component: ReviewsPage      },
  loyalty:   { title: "Loyalty Points",      component: LoyaltyPage      },
  employees: { title: "Employees",           component: EmployeesPage    },
  inventory: { title: "Inventory",           component: InventoryPage    },
  suppliers: { title: "Suppliers",           component: SuppliersPage    },
  finance:   { title: "Finance",             component: FinancePage      },
  reports:   { title: "Reports & Analytics", component: ReportsPage      },
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .adm-root {
    display: flex;
    height: 100vh;
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: #f0f2f5;
  }

  /* ── SIDEBAR ── */
  .adm-sidebar {
    width: 252px;
    min-width: 252px;
    height: 100vh;
    background: #0d0f14;
    display: flex;
    flex-direction: column;
    transition: width 0.22s ease, min-width 0.22s ease;
    overflow: hidden;
    position: relative;
    flex-shrink: 0;
  }
  .adm-sidebar.collapsed { width: 66px; min-width: 66px; }

  /* subtle dot grid overlay */
  .adm-sidebar::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px);
    background-size: 20px 20px;
    pointer-events: none;
    z-index: 0;
  }
  .adm-sidebar > * { position: relative; z-index: 1; }

  /* logo */
  .adm-logo {
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 20px 16px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    flex-shrink: 0;
  }
  .adm-logo-mark {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: linear-gradient(145deg, #ff6b35 0%, #c0392b 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 19px;
    flex-shrink: 0;
    box-shadow: 0 4px 14px rgba(255,107,53,0.45);
  }
  .adm-logo-words { overflow: hidden; white-space: nowrap; }
  .adm-logo-words strong {
    display: block;
    font-size: 14px;
    font-weight: 700;
    color: #fff;
    line-height: 1.25;
    letter-spacing: -0.2px;
  }
  .adm-logo-words strong em { font-style: normal; color: #ff6b35; }
  .adm-logo-words span {
    font-size: 9.5px;
    color: rgba(255,255,255,0.28);
    font-weight: 500;
    letter-spacing: 0.8px;
    text-transform: uppercase;
  }

  /* nav */
  .adm-nav {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 8px 0 12px;
    scrollbar-width: none;
  }
  .adm-nav::-webkit-scrollbar { display: none; }

  .adm-nav-section-label {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 1.4px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.18);
    padding: 16px 20px 5px;
    white-space: nowrap;
    transition: opacity 0.15s, height 0.2s;
  }
  .adm-sidebar.collapsed .adm-nav-section-label {
    opacity: 0;
    height: 0;
    padding-top: 0;
    padding-bottom: 0;
  }

  .adm-nav-item {
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 9px 14px;
    margin: 1px 8px;
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.14s, box-shadow 0.14s;
    position: relative;
    white-space: nowrap;
  }
  .adm-nav-item:hover { background: rgba(255,255,255,0.06); }
  .adm-nav-item:hover .nav-icon { color: #ff6b35; }
  .adm-nav-item:hover .nav-label { color: rgba(255,255,255,0.9); }

  .adm-nav-item.active {
    background: rgba(255,107,53,0.13);
    box-shadow: inset 0 0 0 1px rgba(255,107,53,0.22);
  }
  .adm-nav-item.active .nav-icon { color: #ff6b35; }
  .adm-nav-item.active .nav-label { color: #fff; font-weight: 600; }
  .adm-nav-item.active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 22%;
    height: 56%;
    width: 3px;
    background: linear-gradient(to bottom, #ff6b35, #c0392b);
    border-radius: 0 3px 3px 0;
    box-shadow: 0 0 10px rgba(255,107,53,0.6);
  }

  .nav-icon {
    font-size: 14.5px;
    color: rgba(255,255,255,0.3);
    width: 20px;
    text-align: center;
    flex-shrink: 0;
    transition: color 0.14s;
  }
  .nav-label {
    font-size: 13px;
    color: rgba(255,255,255,0.48);
    font-weight: 500;
    flex: 1;
    overflow: hidden;
    transition: color 0.14s;
  }
  .nav-badge {
    background: #ff6b35;
    color: #fff;
    font-size: 9px;
    font-weight: 700;
    padding: 1px 6px;
    border-radius: 20px;
    flex-shrink: 0;
  }

  /* sidebar footer */
  .adm-sidebar-foot {
    padding: 10px 10px 14px;
    border-top: 1px solid rgba(255,255,255,0.05);
    flex-shrink: 0;
  }
  .adm-user-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 8px;
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.14s;
  }
  .adm-user-row:hover { background: rgba(255,255,255,0.05); }
  .adm-user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: linear-gradient(145deg, #ff6b35, #c0392b);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    color: #fff;
    flex-shrink: 0;
  }
  .adm-user-info { overflow: hidden; }
  .adm-user-name { font-size: 12px; font-weight: 600; color: #fff; white-space: nowrap; }
  .adm-user-sub  { font-size: 10px; color: rgba(255,255,255,0.3); white-space: nowrap; margin-top: 1px; }

  /* ── MAIN ── */
  .adm-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }

  /* topbar */
  .adm-topbar {
    height: 60px;
    background: #fff;
    border-bottom: 1px solid #e9ecef;
    display: flex;
    align-items: center;
    padding: 0 22px;
    gap: 14px;
    flex-shrink: 0;
    box-shadow: 0 1px 0 rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.02);
  }
  .adm-toggle-btn {
    width: 34px;
    height: 34px;
    border: 1.5px solid #e4e6ea;
    border-radius: 8px;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6c757d;
    font-size: 16px;
    transition: all 0.14s;
    flex-shrink: 0;
  }
  .adm-toggle-btn:hover { background: #f8f9fa; border-color: #ced4da; color: #1a1a2e; }

  .adm-page-info { flex: 1; min-width: 0; }
  .adm-page-crumb {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .crumb-home { font-size: 11px; color: #adb5bd; font-weight: 500; }
  .crumb-sep  { font-size: 11px; color: #dee2e6; }
  .crumb-cur  { font-size: 15px; font-weight: 700; color: #0d1117; }

  .adm-topbar-actions {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .adm-action-btn {
    width: 36px;
    height: 36px;
    border-radius: 9px;
    border: 1.5px solid #e9ecef;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6c757d;
    font-size: 15px;
    position: relative;
    transition: all 0.14s;
  }
  .adm-action-btn:hover { background: #f8f9fa; color: #1a1a2e; }
  .adm-notif-dot {
    position: absolute;
    top: 7px;
    right: 7px;
    width: 7px;
    height: 7px;
    background: #ff6b35;
    border-radius: 50%;
    border: 1.5px solid #fff;
  }
  .adm-sep { width: 1px; height: 26px; background: #e9ecef; margin: 0 3px; }
  .adm-top-avatar {
    width: 36px;
    height: 36px;
    border-radius: 9px;
    background: linear-gradient(145deg, #ff6b35, #c0392b);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    color: #fff;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(192,57,43,0.3);
  }

  /* content area */
  .adm-content {
    flex: 1;
    overflow-y: auto;
    padding: 22px;
    scrollbar-width: thin;
    scrollbar-color: #dee2e6 transparent;
  }
`;

export default function AdminPanel({ onLogout }) {
  const [activePage, setActivePage] = useState("dashboard");
  const [collapsed, setCollapsed]   = useState(false);

  const { title, component: ActivePage } = pageMap[activePage] || pageMap.dashboard;

  return (
    <>
      <style>{css}</style>
      <div className="adm-root">

        {/* ── SIDEBAR ── */}
        <aside className={`adm-sidebar${collapsed ? " collapsed" : ""}`}>

          {/* Logo */}
          <div className="adm-logo">
            <div className="adm-logo-mark">🍕</div>
            {!collapsed && (
              <div className="adm-logo-words">
                <strong>Pizza <em>Delicious</em></strong>
                <span>Admin Panel</span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="adm-nav">
            {navGroups.map((group) => (
              <div key={group.label}>
                <div className="adm-nav-section-label">{group.label}</div>
                {group.items.map((item) => (
                  <div
                    key={item.key}
                    className={`adm-nav-item${activePage === item.key ? " active" : ""}`}
                    onClick={() => setActivePage(item.key)}
                    title={collapsed ? item.label : undefined}
                  >
                    <i className={`bi ${item.icon} nav-icon`}></i>
                    {!collapsed && <span className="nav-label">{item.label}</span>}
                    {!collapsed && item.badge && (
                      <span className="nav-badge">{item.badge}</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </nav>

          {/* User / Logout */}
          <div className="adm-sidebar-foot">
            <div className="adm-user-row" onClick={onLogout} title={collapsed ? "Logout" : undefined}>
              <div className="adm-user-avatar">A</div>
              {!collapsed && (
                <div className="adm-user-info">
                  <div className="adm-user-name">Admin User</div>
                  <div className="adm-user-sub">Super Admin · Logout →</div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div className="adm-main">

          {/* Topbar */}
          <header className="adm-topbar">
            <button className="adm-toggle-btn" onClick={() => setCollapsed(c => !c)}>
              <i className={`bi bi-${collapsed ? "layout-sidebar" : "layout-sidebar-inset"}`}></i>
            </button>

            <div className="adm-page-info">
              <div className="adm-page-crumb">
                <span className="crumb-home">Pizza Delicious</span>
                <span className="crumb-sep">›</span>
                <span className="crumb-cur">{title}</span>
              </div>
            </div>

            <div className="adm-topbar-actions">
              <button className="adm-action-btn" title="Search">
                <i className="bi bi-search"></i>
              </button>
              <button className="adm-action-btn" title="Notifications">
                <i className="bi bi-bell"></i>
                <span className="adm-notif-dot"></span>
              </button>
              <div className="adm-sep"></div>
              <div className="adm-top-avatar" title="Admin">A</div>
            </div>
          </header>

          {/* Page */}
          <main className="adm-content">
            <ActivePage />
          </main>
        </div>

      </div>
    </>
  );
}