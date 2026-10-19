import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, BedDouble, CalendarDays, Users, Wallet, Package, Wrench, Megaphone,
  ChartNoAxesCombined, Settings, Bell, Search, Menu, Plus, ArrowUpRight, ArrowDownRight,
  CheckCircle2, AlertTriangle, Clock3, ChevronDown, Building2, LogOut, X, RefreshCw,
  UserRound, CalendarCheck, ClipboardList, FileText, CircleDollarSign, Sparkles
} from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, AreaChart, Area } from 'recharts';
import { api, money } from './api';

type AnyRow = Record<string, any>;
function statusVi(status: string) {
  const labels: Record<string, string> = {
    'Checked in': 'Đã nhận phòng', 'Arriving today': 'Đến hôm nay', 'Clean': 'Sạch / sẵn sàng',
    'Dirty': 'Cần dọn', 'Occupied': 'Đang có khách', 'Maintenance': 'Bảo trì', 'Inspected': 'Đã kiểm tra',
    'On shift': 'Đang làm ca', 'Pending': 'Chờ duyệt', 'Approved': 'Đã duyệt', 'Running': 'Đang chạy',
    'Overdue': 'Quá hạn', 'High': 'Cao', 'Active': 'Đang hoạt động'
  };
  return labels[status] || status;
}
const navGroups = [
  { label: 'KHÔNG GIAN LÀM VIỆC', items: [
    { to: '/', label: 'Tổng quan', icon: LayoutDashboard },
    { to: '/reservations', label: 'Đặt phòng', icon: CalendarDays },
    { to: '/rooms', label: 'Quản lý phòng', icon: BedDouble },
  ]},
  { label: 'VẬN HÀNH', items: [
    { to: '/employees', label: 'Nhân sự', icon: Users },
    { to: '/finance', label: 'Tài chính & chi phí', icon: Wallet },
    { to: '/inventory', label: 'Kho hàng', icon: Package },
    { to: '/maintenance', label: 'Bảo trì', icon: Wrench },
    { to: '/marketing', label: 'Doanh nghiệp marketing', icon: Megaphone },
  ]},
  { label: 'QUẢN TRỊ', items: [
    { to: '/reports', label: 'Báo cáo & phân tích', icon: ChartNoAxesCombined },
    { to: '/settings', label: 'Cài đặt', icon: Settings },
  ]}
];
const titleMap: Record<string, string> = {
  '/': 'Tổng quan doanh nghiệp', '/reservations': 'Đặt phòng', '/rooms': 'Quản lý phòng',
  '/employees': 'Nhân sự', '/finance': 'Tài chính & chi phí', '/inventory': 'Kho hàng',
  '/maintenance': 'Bảo trì', '/marketing': 'Doanh nghiệp marketing', '/reports': 'Báo cáo & phân tích', '/settings': 'Cài đặt'
};
function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: string }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}
function Button({ children, onClick, variant = 'primary', type = 'button' }: { children: ReactNode; onClick?: () => void; variant?: string; type?: 'button'|'submit' }) {
  return <button type={type} className={`button ${variant}`} onClick={onClick}>{children}</button>;
}
function Panel({ title, subtitle, action, children }: { title: string; subtitle?: string; action?: ReactNode; children: ReactNode }) {
  return <section className="panel"><div className="panel-head"><div><h3>{title}</h3>{subtitle && <p>{subtitle}</p>}</div>{action}</div>{children}</section>;
}
function EmptyState({ title, text }: { title: string; text: string }) {
  return <div className="empty"><ClipboardList size={24}/><strong>{title}</strong><span>{text}</span></div>;
}
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [property, setProperty] = useState('all');
  const [properties, setProperties] = useState<AnyRow[]>([]);
  const [search, setSearch] = useState('');
  const location = useLocation();
  const pageTitle = titleMap[location.pathname] || 'Quản lý doanh nghiệp';
  useEffect(() => { api.properties().then(r => setProperties(r.data)).catch(() => {}); }, []);
  return <div className="app-shell">
    <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      <div className="brand"><div className="brand-mark"><Building2 size={20}/></div><div><strong>Haven Group</strong><span>QUẢN LÝ DOANH NGHIỆP</span></div><button className="icon-button mobile-close" onClick={() => setSidebarOpen(false)}><X size={18}/></button></div>
      <div className="workspace-select"><div className="workspace-icon"><Building2 size={17}/></div><div><span>KHÔNG GIAN LÀM VIỆC</span><strong>Nhóm khách sạn</strong></div><ChevronDown size={15}/></div>
      <nav>{navGroups.map(group => <div className="nav-group" key={group.label}><span className="nav-label">{group.label}</span>{group.items.map(item => { const Icon = item.icon; return <NavLink end={item.to === '/'} to={item.to} key={item.to} onClick={() => setSidebarOpen(false)} className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}><Icon size={18}/><span>{item.label}</span>{item.to === '/reservations' && <small className="nav-count">5</small>}</NavLink>; })}</div>)}</nav>
      <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><Sparkles size={16}/></div><strong>Bạn cần hỗ trợ?</strong><p>Hệ thống quản lý nội bộ đang ở chế độ dùng thử.</p><button onClick={() => alert('This is a frontend demo. Add a help module when your backend is ready.')}>View help <ArrowUpRight size={14}/></button></div><div className="user-mini"><div className="avatar">BO</div><div><strong>Chủ doanh nghiệp</strong><span>Quản trị viên · Bản dùng thử</span></div><button className="icon-button" title="Tài khoản"><LogOut size={16}/></button></div></div>
    </aside>
    {sidebarOpen && <button className="scrim" onClick={() => setSidebarOpen(false)} aria-label="Close navigation"/>}
    <main className="main-area">
      <header className="topbar"><div className="top-left"><button className="icon-button mobile-menu" onClick={() => setSidebarOpen(true)}><Menu size={20}/></button><div className="breadcrumbs">Không gian làm việc <span>/</span> <strong>{pageTitle}</strong></div></div><div className="top-actions"><label className="property-filter"><Building2 size={16}/><select value={property} onChange={e => setProperty(e.target.value)}><option value="all">Tất cả doanh nghiệp</option>{properties.map(p => <option value={p.id} key={p.id}>{p.name}</option>)}<option value="marketing">Doanh nghiệp marketing</option></select><ChevronDown size={14}/></label><button className="icon-button top-search" onClick={() => document.getElementById('global-search')?.focus()} title="Tìm kiếm"><Search size={18}/></button><button className="icon-button notification" title="Thông báo" onClick={() => alert('Demo notifications: 3 maintenance tasks and 2 contract renewals require attention.')}><Bell size={18}/><i/></button><div className="top-divider"/><div className="top-user"><div className="avatar">BO</div><div><strong>Chủ doanh nghiệp</strong><span>Tài khoản chủ sở hữu</span></div><ChevronDown size={14}/></div></div></header>
      <div className="page-wrap"><Routes>
        <Route path="/" element={<Dashboard property={property}/>} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/rooms" element={<Rooms property={property}/>} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/finance" element={<Finance />} />
        <Route path="/inventory" element={<ComingSoon title="Quản lý kho" description="Theo dõi vật tư, tồn kho, đơn mua hàng và điều chuyển giữa các cơ sở." icon={<Package/>}/>} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/marketing" element={<Marketing />} />
        <Route path="/reports" element={<Reports property={property}/>} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes><footer>© 2026 Haven Group <span>Hệ thống quản lý nội bộ · Chỉ sử dụng dữ liệu mẫu</span></footer></div>
    </main>
  </div>;
}
function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description: string; actions?: ReactNode }) {
  return <div className="page-header"><div><div className="eyebrow">{eyebrow || 'TỔNG QUAN'}</div><h1>{title}</h1><p>{description}</p></div>{actions && <div className="header-actions">{actions}</div>}</div>;
}
function StatCard({ title, value, change, icon, positive = true, note }: { title: string; value: string; change?: string; icon: ReactNode; positive?: boolean; note?: string }) {
  return <div className="stat-card"><div className="stat-top"><span>{title}</span><div className="stat-icon">{icon}</div></div><strong className="stat-value">{value}</strong><div className="stat-bottom">{change && <span className={positive ? 'trend up' : 'trend down'}>{positive ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>} {change}</span>}<span>{note || 'so với kỳ trước'}</span></div></div>;
}
function Dashboard({ property }: { property: string }) {
  const [data, setData] = useState<AnyRow | null>(null);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(0);
  useEffect(() => { api.overview(property).then(r => {setData(r.data); setError('');}).catch(e => setError(e.message)); }, [property, refresh]);
  if (error) return <ErrorState error={error} retry={() => setRefresh(x => x + 1)}/>;
  if (!data) return <div className="loading"><RefreshCw className="spin"/> Loading dashboard…</div>;
  return <>
    <PageHeader eyebrow="MONDAY, OCTOBER 19, 2026" title="Chào buổi sáng, Chủ doanh nghiệp" description="Dưới đây là tình hình hoạt động hôm nay của các doanh nghiệp." actions={<><Button variant="secondary" onClick={() => setRefresh(x => x + 1)}><RefreshCw size={15}/> Refresh</Button><Button onClick={() => window.location.href='/reservations'}><Plus size={16}/> Tạo đặt phòng mới</Button></>}/>
    <div className="notice demo-notice"><Sparkles size={17}/><div><strong>Môi trường dùng thử</strong><span>Các số liệu này là dữ liệu mẫu. Thay đổi sẽ được lưu cục bộ bởi API mô phỏng.</span></div><Badge tone="info">API MÔ PHỎNG</Badge></div>
    <div className="stat-grid">
      <StatCard title="Tổng doanh thu" value={money(data.revenue)} change="+8.2%" icon={<CircleDollarSign size={19}/>} note="tháng này"/>
      <StatCard title="Lợi nhuận hoạt động" value={money(data.operatingProfit)} change="+5.4%" icon={<ChartNoAxesCombined size={19}/>} note="ước tính · biên lợi nhuận 30%"/>
      <StatCard title="Công suất phòng" value={`${data.occupancy}%`} change="+3.1%" icon={<BedDouble size={19}/>} note="trên các khách sạn đã chọn"/>
      <StatCard title="Nhân viên đang làm việc" value={String(data.employeeCount)} icon={<Users size={19}/>} note="toàn hệ thống"/>
    </div>
    <div className="content-grid two-one">
      <Panel title="Hiệu quả doanh thu" subtitle="Doanh thu hàng tháng theo khách sạn · triệu đồng" action={<button className="text-button" onClick={() => window.location.href='/reports'}>View report <ArrowUpRight size={14}/></button>}>
        <div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data.revenueTrend} margin={{top:12,right:10,left:0,bottom:0}}><defs><linearGradient id="blueArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4779ed" stopOpacity={0.18}/><stop offset="95%" stopColor="#4779ed" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf0f5"/><XAxis dataKey="month" tickLine={false} axisLine={false} tick={{fontSize:11,fill:'#8a94a6'}}/><YAxis tickLine={false} axisLine={false} tick={{fontSize:11,fill:'#8a94a6'}} width={36}/><Tooltip formatter={(v:any) => [`₫${v}M`, 'Doanh thu']}/><Area type="monotone" dataKey="hotelA" name="Hotel A" stroke="#4779ed" fill="url(#blueArea)" strokeWidth={2.5}/><Area type="monotone" dataKey="hotelB" name="Hotel B" stroke="#25b99a" fill="transparent" strokeWidth={2.5}/></AreaChart></ResponsiveContainer></div>
        <div className="legend"><span><i className="blue-dot"/> Hotel A</span><span><i className="green-dot"/> Hotel B</span></div>
      </Panel>
      <Panel title="Hotel performance" subtitle="Current occupancy" action={<button className="icon-button" title="Details" onClick={() => window.location.href='/rooms'}><ArrowUpRight size={17}/></button>}>
        <div className="property-list">{data.properties.map((p: AnyRow) => <div className="property-row" key={p.id}><div className="property-symbol"><Building2 size={18}/></div><div className="property-info"><strong>{p.name}</strong><span>{p.rooms} rooms · {p.city}</span><div className="progress"><i style={{width:`${p.occupancy}%`}}/></div></div><div className="property-number"><strong>{p.occupancy}%</strong><span>đang có khách</span></div></div>)}</div>
        <div className="property-footer"><span>Tổng doanh thu tháng</span><strong>{money(data.revenue)}</strong></div>
      </Panel>
    </div>
    <div className="content-grid two-one lower-grid">
      <Panel title="Hoạt động đặt phòng" subtitle="Các đặt phòng gần đây và sắp tới" action={<button className="text-button" onClick={() => window.location.href='/reservations'}>All reservations <ArrowUpRight size={14}/></button>}>
        <ReservationTable rows={data.reservations.slice(0,4)} compact/>
      </Panel>
      <Panel title="Needs attention" subtitle="Tasks that may need action" action={<Badge tone="warning">{data.tasks.length} items</Badge>}>
        <div className="attention-list">{data.tasks.map((task: AnyRow) => <div className="attention-item" key={task.id}><div className={`attention-icon ${task.priority === 'High' ? 'urgent' : ''}`}><AlertTriangle size={16}/></div><div className="attention-text"><strong>{task.title}</strong><span>{task.property} · {task.assignee}</span></div><Badge tone={task.status === 'Overdue' ? 'danger' : 'warning'}>{statusVi(task.status)}</Badge></div>)}</div>
      </Panel>
    </div>
    <Panel title="Hoạt động gần đây" subtitle="Cập nhật mới nhất trong doanh nghiệp"><div className="activity-list">{data.activity.map((a: AnyRow) => <div className="activity-item" key={a.id}><div className="activity-dot"><CheckCircle2 size={16}/></div><div><strong>{a.text}</strong><span>{a.by}</span></div><time>{a.time}</time></div>)}</div></Panel>
  </>;
}
function SearchBar({ value, onChange, placeholder = 'Tìm kiếm dữ liệu...' }: { value: string; onChange: (v:string)=>void; placeholder?: string }) {
  return <label className="search-box"><Search size={17}/><input id="global-search" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}/>{value && <button type="button" onClick={() => onChange('')}><X size={14}/></button>}</label>;
}
function ReservationTable({ rows, compact = false }: { rows: AnyRow[]; compact?: boolean }) {
  if (!rows.length) return <EmptyState title="Không tìm thấy đặt phòng" text="Hãy thay đổi nội dung tìm kiếm hoặc thêm đặt phòng."/>;
  return <div className="table-scroll"><table><thead><tr><th>MÃ ĐẶT PHÒNG / KHÁCH</th><th>PHÒNG</th><th>LƯU TRÚ</th><th>TRẠNG THÁI</th>{!compact && <th>SỐ TIỀN</th>}</tr></thead><tbody>{rows.map(r => <tr key={r.id}><td><strong>{r.guest}</strong><span className="cell-sub">{r.id} · {r.source}</span></td><td>{r.room}</td><td><span>{r.checkIn}</span><span className="cell-sub">đến {r.checkOut}</span></td><td><Badge tone={r.status === 'Checked in' ? 'success' : r.status === 'Arriving today' ? 'info' : 'neutral'}>{statusVi(r.status)}</Badge></td>{!compact && <td className="amount-cell">{money(r.amount)}</td>}</tr>)}</tbody></table></div>;
}
function Reservations() {
  const [rows, setRows] = useState<AnyRow[]>([]); const [query, setQuery] = useState(''); const [open, setOpen] = useState(false); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const load = () => { setLoading(true); api.reservations(query).then(r => setRows(r.data)).catch(e => setError(e.message)).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, [query]);
  async function submit(e: FormEvent<HTMLFormElement>) { e.preventDefault(); const f = new FormData(e.currentTarget); try { await api.createReservation({ guest:f.get('guest'), propertyId:f.get('propertyId'), room:f.get('room'), checkIn:f.get('checkIn'), checkOut:f.get('checkOut'), guests:f.get('guests'), amount:f.get('amount'), source:f.get('source') }); setOpen(false); load(); } catch(e:any) { alert(e.message); } }
  return <><PageHeader eyebrow="VẬN HÀNH KHÁCH SẠN" title="Đặt phòng" description="Quản lý đặt phòng, ngày lưu trú và trạng thái đặt phòng." actions={<Button onClick={() => setOpen(true)}><Plus size={16}/> Tạo đặt phòng mới</Button>}/><div className="toolbar"><SearchBar value={query} onChange={setQuery} placeholder="Tìm khách, mã đặt phòng, nguồn đặt…"/><div className="toolbar-right"><Badge tone="info">{rows.length} bookings</Badge><Button variant="secondary" onClick={load}><RefreshCw size={15}/> Làm mới</Button></div></div>{error && <div className="notice error">{error}</div>}<Panel title="Tất cả đặt phòng" subtitle="Đặt phòng mẫu từ API mô phỏng">{loading ? <div className="loading">Đang tải đặt phòng…</div> : <ReservationTable rows={rows}/>}</Panel>{open && <Modal title="Tạo đặt phòng" onClose={() => setOpen(false)}><form className="form-grid" onSubmit={submit}><label className="span-2">Họ và tên khách<input name="guest" required placeholder="Nhập tên khách"/></label><label>Hotel<select name="propertyId"><option value="hotel-a">Khách sạn A</option><option value="hotel-b">Khách sạn B</option></select></label><label>Số phòng<input name="room" placeholder="Chưa phân phòng"/></label><label>Nhận phòng<input type="date" name="checkIn" required defaultValue="2026-10-20"/></label><label>Trả phòng<input type="date" name="checkOut" required defaultValue="2026-10-21"/></label><label>Số khách<input type="number" name="guests" min="1" defaultValue="2"/></label><label>Số tiền (VNĐ)<input type="number" name="amount" min="0" defaultValue="1500000"/></label><label className="span-2">Nguồn đặt phòng<select name="source"><option>Direct</option><option>Phone</option><option>Walk-in</option><option>Booking.com</option><option>Agoda</option><option>Đại lý du lịch</option></select></label><div className="form-actions span-2"><Button variant="secondary" onClick={() => setOpen(false)}>Hủy</Button><Button type="submit">Tạo đặt phòng</Button></div></form></Modal>}</>;
}
function Rooms({ property }: { property: string }) {
  const [rows, setRows] = useState<AnyRow[]>([]); const [query, setQuery] = useState('');
  const load = () => api.rooms(query).then(r => setRows(r.data.filter((x:AnyRow) => property === 'all' || x.propertyId === property))).catch(() => {});
  useEffect(() => { load(); }, [query, property]);
  async function changeStatus(id: string, status: string) { await api.updateRoomStatus(id, status); load(); }
  const counts = useMemo(() => ({available: rows.filter(r => r.status === 'Clean').length, occupied: rows.filter(r => r.status === 'Occupied').length, dirty: rows.filter(r => r.status === 'Dirty').length, maintenance: rows.filter(r => r.status === 'Maintenance').length}), [rows]);
  return <><PageHeader eyebrow="VẬN HÀNH KHÁCH SẠN" title="Quản lý phòng" description="Xem tình trạng phòng trống và cập nhật trạng thái vận hành." actions={<Button variant="secondary" onClick={load}><RefreshCw size={15}/> Làm mới</Button>}/><div className="mini-stat-grid"><div><span>Sạch / sẵn sàng</span><strong>{counts.available}</strong></div><div><span>Đang có khách</span><strong>{counts.occupied}</strong></div><div><span>Cần dọn phòng</span><strong>{counts.dirty}</strong></div><div><span>Bảo trì</span><strong>{counts.maintenance}</strong></div></div><div className="toolbar"><SearchBar value={query} onChange={setQuery} placeholder="Tìm số phòng hoặc loại phòng…"/><span className="muted">{rows.length} phòng mẫu</span></div><div className="room-grid">{rows.map(room => <div className={`room-card status-${room.status.toLowerCase().replace(' ','-')}`} key={room.id}><div className="room-card-top"><div className="room-number">{room.number}</div><Badge tone={room.status==='Clean'?'success':room.status==='Occupied'?'info':room.status==='Dirty'?'warning':'danger'}>{statusVi(room.status)}</Badge></div><strong>{room.type}</strong><span>{room.propertyId === 'hotel-a' ? 'Khách sạn A' : 'Khách sạn B'} · Tầng {room.floor}</span><label>Cập nhật trạng thái<select value={room.status} onChange={e => changeStatus(room.id,e.target.value)}><option>Clean</option><option>Dirty</option><option>Occupied</option><option>Maintenance</option><option>Inspected</option></select></label></div>)}</div></>;
}
function Employees() {
  const [rows, setRows] = useState<AnyRow[]>([]); const [query, setQuery] = useState(''); const [open,setOpen] = useState(false);
  const load = () => api.employees(query).then(r => setRows(r.data)).catch(() => {});
  useEffect(() => { load(); }, [query]);
  async function submit(e: FormEvent<HTMLFormElement>) { e.preventDefault(); const f = new FormData(e.currentTarget); await api.createEmployee({name:f.get('name'), role:f.get('role'), property:f.get('property'), department:f.get('department'), salary:f.get('salary')}); setOpen(false); load(); }
  return <><PageHeader eyebrow="NHÂN SỰ & VĂN HÓA" title="Nhân sự" description="Danh sách nhân viên và tổng quan nhân sự." actions={<Button onClick={() => setOpen(true)}><Plus size={16}/> Thêm nhân viên</Button>}/><div className="mini-stat-grid"><div><span>Tổng số nhân viên</span><strong>{rows.length}</strong></div><div><span>Đang làm ca</span><strong>{rows.filter(r=>r.status==='On shift').length}</strong></div><div><span>Phòng ban</span><strong>{new Set(rows.map(r=>r.department)).size}</strong></div><div><span>Tổng lương cơ bản hàng tháng</span><strong>{money(rows.reduce((s,r)=>s+Number(r.salary||0),0))}</strong></div></div><div className="toolbar"><SearchBar value={query} onChange={setQuery} placeholder="Tìm nhân viên, chức vụ, phòng ban…"/></div><Panel title="Danh sách nhân viên" subtitle="Dữ liệu mẫu; thông tin lương chỉ hiển thị để thử nghiệm giao diện"><div className="table-scroll"><table><thead><tr><th>NHÂN VIÊN</th><th>CHỨC VỤ / PHÒNG BAN</th><th>CƠ SỞ</th><th>TRẠNG THÁI</th><th>LƯƠNG CƠ BẢN / THÁNG</th></tr></thead><tbody>{rows.map(r=><tr key={r.id}><td><div className="employee-cell"><div className="avatar">{r.name.split(' ').slice(-1)[0].slice(0,1)}{r.name.split(' ')[0].slice(0,1)}</div><div><strong>{r.name}</strong><span className="cell-sub">{r.id}</span></div></div></td><td><strong>{r.role}</strong><span className="cell-sub">{r.department}</span></td><td>{r.property}</td><td><Badge tone={r.status==='On shift'?'success':'neutral'}>{statusVi(r.status)}</Badge></td><td className="amount-cell">{money(r.salary)}</td></tr>)}</tbody></table></div></Panel>{open && <Modal title="Thêm nhân viên" onClose={() => setOpen(false)}><form className="form-grid" onSubmit={submit}><label className="span-2">Họ và tên<input name="name" required placeholder="Họ tên nhân viên"/></label><label>Chức danh<input name="role" required placeholder="VD: Lễ tân"/></label><label>Phòng ban<input name="department" placeholder="VD: Bộ phận tiền sảnh"/></label><label>Cơ sở<select name="property"><option>Khách sạn A</option><option>Khách sạn B</option><option>Toàn hệ thống</option><option>Marketing</option></select></label><label>Lương cơ bản hàng tháng (VNĐ)<input type="number" name="salary" min="0" defaultValue="9000000"/></label><div className="form-actions span-2"><Button variant="secondary" onClick={() => setOpen(false)}>Hủy</Button><Button type="submit">Lưu nhân viên</Button></div></form></Modal>}</>;
}
function Finance() {
  const [rows,setRows] = useState<AnyRow[]>([]); const [query,setQuery] = useState(''); const [open,setOpen] = useState(false);
  const load=()=>api.expenses(query).then(r=>setRows(r.data)).catch(()=>{}); useEffect(()=>{load();},[query]);
  async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();const f=new FormData(e.currentTarget);await api.createExpense({description:f.get('description'),category:f.get('category'),property:f.get('property'),amount:f.get('amount'),date:f.get('date')});setOpen(false);load();}
  const total=rows.reduce((s,r)=>s+Number(r.amount||0),0);
  return <><PageHeader eyebrow="TÀI CHÍNH" title="Tài chính & chi phí" description="Theo dõi chi phí vận hành và trạng thái phê duyệt." actions={<Button onClick={()=>setOpen(true)}><Plus size={16}/> Ghi nhận chi phí</Button>}/><div className="mini-stat-grid"><div><span>Chi phí trong dữ liệu mẫu</span><strong>{money(total)}</strong></div><div><span>Chờ phê duyệt</span><strong>{rows.filter(r=>r.status==='Pending').length}</strong></div><div><span>Đã duyệt</span><strong>{rows.filter(r=>r.status==='Approved').length}</strong></div><div><span>Số bản ghi</span><strong>{rows.length}</strong></div></div><div className="toolbar"><SearchBar value={query} onChange={setQuery} placeholder="Tìm kiếm chi phí…"/></div><Panel title="Danh sách chi phí" subtitle="Dữ liệu mẫu được lưu bởi API mô phỏng"><div className="table-scroll"><table><thead><tr><th>NGÀY / MÃ THAM CHIẾU</th><th>MÔ TẢ</th><th>DANH MỤC</th><th>CƠ SỞ</th><th>TRẠNG THÁI</th><th>SỐ TIỀN</th></tr></thead><tbody>{rows.map(r=><tr key={r.id}><td><strong>{r.date}</strong><span className="cell-sub">{r.id}</span></td><td>{r.description}</td><td>{r.category}</td><td>{r.property}</td><td><Badge tone={r.status==='Approved'?'success':'warning'}>{statusVi(r.status)}</Badge></td><td className="amount-cell">{money(r.amount)}</td></tr>)}</tbody></table></div></Panel>{open&&<Modal title="Ghi nhận chi phí" onClose={()=>setOpen(false)}><form className="form-grid" onSubmit={submit}><label className="span-2">Mô tả<input name="description" required placeholder="Nội dung mua hàng hoặc thanh toán"/></label><label>Danh mục<select name="category"><option>Utilities</option><option>Supplies</option><option>Maintenance</option><option>Payroll</option><option>Marketing</option><option>Other</option></select></label><label>Đơn vị kinh doanh<select name="property"><option>Khách sạn A</option><option>Khách sạn B</option><option>Marketing</option></select></label><label>Số tiền (VNĐ)<input type="number" name="amount" min="1" required/></label><label>Ngày<input type="date" name="date" defaultValue="2026-10-19"/></label><div className="form-actions span-2"><Button variant="secondary" onClick={()=>setOpen(false)}>Hủy</Button><Button type="submit">Lưu chi phí</Button></div></form></Modal>}</>;
}
function Maintenance() {
  const [tasks,setTasks]=useState<AnyRow[]>([]); useEffect(()=>{api.tasks().then(r=>setTasks(r.data)).catch(()=>{});},[]);
  return <><PageHeader eyebrow="VẬN HÀNH CƠ SỞ" title="Bảo trì" description="Theo dõi sửa chữa, yêu cầu dịch vụ và công việc tại cơ sở." actions={<Button onClick={()=>alert('Tính năng tạo yêu cầu sẽ được bổ sung ở phiên bản tiếp theo.')}><Plus size={16}/> Tạo yêu cầu mới</Button>}/><div className="mini-stat-grid"><div><span>Công việc đang mở</span><strong>{tasks.length}</strong></div><div><span>Ưu tiên cao</span><strong>{tasks.filter(t=>t.priority==='High').length}</strong></div><div><span>Quá hạn</span><strong>{tasks.filter(t=>t.status==='Overdue').length}</strong></div><div><span>Hoàn thành hôm nay</span><strong>4</strong></div></div><Panel title="Công việc bảo trì & vận hành" subtitle="Danh sách công việc mẫu"><div className="table-scroll"><table><thead><tr><th>CÔNG VIỆC</th><th>CƠ SỞ</th><th>NGƯỜI PHỤ TRÁCH</th><th>MỨC ƯU TIÊN</th><th>TRẠNG THÁI</th></tr></thead><tbody>{tasks.map(t=><tr key={t.id}><td><strong>{t.title}</strong><span className="cell-sub">{t.id}</span></td><td>{t.property}</td><td>{t.assignee}</td><td><Badge tone={t.priority==='High'?'danger':'neutral'}>{t.priority === 'High' ? 'Cao' : t.priority}</Badge></td><td><Badge tone={t.status==='Overdue'?'warning':'info'}>{t.status === 'Overdue' ? 'Quá hạn' : t.status}</Badge></td></tr>)}</tbody></table></div></Panel></>;
}
function Marketing() {
  const [clients,setClients]=useState<AnyRow[]>([]);const [campaigns,setCampaigns]=useState<AnyRow[]>([]);
  useEffect(()=>{api.clients().then(r=>setClients(r.data));api.campaigns().then(r=>setCampaigns(r.data));},[]);
  return <><PageHeader eyebrow="DOANH NGHIỆP MARKETING" title="Tổng quan marketing" description="Theo dõi khách hàng, chiến dịch, ngân sách và khách hàng tiềm năng." actions={<Button onClick={()=>alert('Tính năng thêm khách hàng sẽ được bổ sung ở phiên bản tiếp theo.')}><Plus size={16}/> Thêm khách hàng</Button>}/><div className="stat-grid three"><StatCard title="Khách hàng đang hoạt động" value={String(clients.length)} icon={<Users size={19}/>} note="bao gồm công việc nội bộ cho khách sạn"/><StatCard title="Chiến dịch đang chạy" value={String(campaigns.filter(c=>c.status==='Running').length)} icon={<Megaphone size={19}/>} note="trên các tài khoản đang quản lý"/><StatCard title="Khách hàng tiềm năng từ chiến dịch" value={String(campaigns.reduce((s,c)=>s+c.leads,0))} change="+12%" icon={<ChartNoAxesCombined size={19}/>} note="dữ liệu chiến dịch mẫu"/></div><div className="content-grid two-one"><Panel title="Danh mục khách hàng" subtitle="Khách hàng marketing hiện tại"><div className="table-scroll"><table><thead><tr><th>KHÁCH HÀNG</th><th>DỊCH VỤ</th><th>TRẠNG THÁI</th><th>PHÍ HÀNG THÁNG</th></tr></thead><tbody>{clients.map(c=><tr key={c.id}><td><strong>{c.name}</strong><span className="cell-sub">{c.id}</span></td><td>{c.service}</td><td><Badge tone="success">{statusVi(c.status)}</Badge></td><td className="amount-cell">{money(c.monthlyFee)}</td></tr>)}</tbody></table></div></Panel><Panel title="Chiến dịch" subtitle="Hoạt động hiện tại">{campaigns.map(c=><div className="campaign-row" key={c.id}><div className="campaign-icon"><Megaphone size={17}/></div><div className="campaign-info"><strong>{c.name}</strong><span>{c.client}</span><div className="campaign-meta"><Badge tone="success">{statusVi(c.status)}</Badge><span>{c.leads} khách hàng tiềm năng</span></div></div><strong>{money(c.budget)}</strong></div>)}</Panel></div></>;
}
function Reports({property}:{property:string}) {
  const [data,setData]=useState<AnyRow|null>(null);useEffect(()=>{api.overview(property).then(r=>setData(r.data));},[property]);
  return <><PageHeader eyebrow="PHÂN TÍCH KINH DOANH" title="Báo cáo & phân tích" description="Theo dõi các chỉ số hiệu quả trên bảng điều khiển chủ doanh nghiệp." actions={<Button variant="secondary" onClick={()=>window.print()}><FileText size={16}/> Print report</Button>}/><div className="stat-grid"><StatCard title="Doanh thu" value={money(data?.revenue||0)} icon={<CircleDollarSign size={19}/>} note="tháng mẫu"/><StatCard title="Lợi nhuận hoạt động" value={money(data?.operatingProfit||0)} icon={<ChartNoAxesCombined size={19}/>} note="ước tính minh họa"/><StatCard title="Công suất phòng" value={`${data?.occupancy||0}%`} icon={<BedDouble size={19}/>} note="selected properties"/><StatCard title="Nhân sự" value={String(data?.employeeCount||0)} icon={<Users size={19}/>} note="dữ liệu mẫu toàn hệ thống"/></div><Panel title="So sánh doanh thu" subtitle="Triệu đồng · số liệu mẫu"><div className="chart-wrap tall"><ResponsiveContainer width="100%" height="100%"><BarChart data={data?.revenueTrend||[]} margin={{top:12,right:10,left:0,bottom:0}}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf0f5"/><XAxis dataKey="month" tickLine={false} axisLine={false}/><YAxis tickLine={false} axisLine={false}/><Tooltip/><Bar dataKey="hotelA" name="Hotel A" fill="#4779ed" radius={[5,5,0,0]}/><Bar dataKey="hotelB" name="Hotel B" fill="#25b99a" radius={[5,5,0,0]}/></BarChart></ResponsiveContainer></div></Panel><div className="notice"><AlertTriangle size={17}/><div><strong>Lưu ý về báo cáo</strong><span>Lợi nhuận hoạt động chỉ là số liệu ước tính để minh họa, không phải kết quả kế toán chính thức. Hãy kết nối giao dịch đã xác minh và quy tắc kế toán trước khi sử dụng báo cáo để ra quyết định.</span></div></div></>;
}
function SettingsPage() {
  return <><PageHeader eyebrow="QUẢN TRỊ HỆ THỐNG" title="Cài đặt" description="Cấu hình cách tổ chức hệ thống quản lý doanh nghiệp."/><div className="settings-grid">{[{icon:<Building2/>,title:'Doanh nghiệp & cơ sở',text:'Quản lý khách sạn, đơn vị kinh doanh, địa chỉ và cài đặt vận hành.'},{icon:<Users/>,title:'Người dùng & quyền truy cập',text:'Quản lý tài khoản, vai trò và quyền truy cập cơ sở.'},{icon:<Wallet/>,title:'Cấu hình tài chính',text:'Thiết lập tiền tệ, danh mục chi phí và ngưỡng phê duyệt.'},{icon:<Bell/>,title:'Thông báo',text:'Chọn cảnh báo và lời nhắc gửi đến từng vai trò.'},{icon:<FileText/>,title:'Tài liệu & chính sách',text:'Cấu hình danh mục tài liệu và chính sách lưu trữ.'},{icon:<Settings/>,title:'Tùy chọn hệ thống',text:'Ngôn ngữ, múi giờ, định dạng ngày và tùy chọn ứng dụng.'}].map((s,i)=><button className="settings-card" key={i} onClick={()=>alert('Đây là phần giao diện cài đặt mẫu. Mô-đun sẽ được kết nối với API trong phiên bản sau.')}><div className="settings-icon">{s.icon}</div><strong>{s.title}</strong><span>{s.text}</span><ArrowUpRight size={16}/></button>)}</div><div className="notice demo-notice"><AlertTriangle size={17}/><div><strong>Bảo mật bản thử nghiệm</strong><span>Chế độ dùng thử chưa có xác thực hoặc phân quyền thực tế. Không nhập dữ liệu cá nhân, tiền lương hoặc tài chính thật.</span></div></div></>;
}
function ComingSoon({title,description,icon}:{title:string;description:string;icon:ReactNode}) {
  return <><PageHeader eyebrow="VẬN HÀNH DOANH NGHIỆP" title={title} description={description}/><div className="coming-card"><div className="coming-icon">{icon}</div><h2>Đã có khung mô-đun</h2><p>Mục này đã có trong menu và có thể được phát triển tiếp theo. API và quy trình vận hành chính thức chưa được triển khai trong API mô phỏng.</p><Button onClick={()=>alert('This module is on the implementation roadmap.')}>View implementation roadmap <ArrowUpRight size={15}/></Button></div></>;
}
function Modal({title,onClose,children}:{title:string;onClose:()=>void;children:ReactNode}) {
  return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}><div className="modal"><div className="modal-head"><h2>{title}</h2><button className="icon-button" onClick={onClose}><X size={18}/></button></div>{children}</div></div>;
}
function ErrorState({error,retry}:{error:string;retry:()=>void}) { return <div className="error-state"><AlertTriangle size={24}/><h2>Không thể tải dữ liệu</h2><p>{error}. Make sure the simulated API server is running.</p><Button onClick={retry}><RefreshCw size={15}/> Try again</Button></div>; }
export default App;
