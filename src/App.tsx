import { useMemo, useState } from 'react';

type View = 'Visão geral' | 'Agenda' | 'Serviços' | 'Profissionais';
type Service = { name: string; minutes: number; price: number };

const services: Service[] = [
  { name: 'Corte masculino', minutes: 40, price: 45 },
  { name: 'Barba', minutes: 30, price: 30 },
  { name: 'Corte + barba', minutes: 60, price: 65 },
];
const professionals = ['André', 'Lucas', 'Rafael'];
const slots = ['09:00', '10:30', '13:00', '14:30', '16:00'];
const initialAppointments = [
  { time: '09:00', client: 'Carlos Almeida', service: 'Corte masculino', professional: 'André', status: 'Confirmado' },
  { time: '10:30', client: 'Bruno Oliveira', service: 'Corte + barba', professional: 'Lucas', status: 'Confirmado' },
  { time: '14:30', client: 'Marcos Silva', service: 'Barba', professional: 'Rafael', status: 'Pendente' },
];

function money(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export default function App() {
  const [view, setView] = useState<View>('Visão geral');
  const [appointments, setAppointments] = useState(initialAppointments);
  const [service, setService] = useState(services[0].name);
  const [professional, setProfessional] = useState(professionals[0]);
  const [time, setTime] = useState(slots[0]);
  const [client, setClient] = useState('');
  const [notice, setNotice] = useState('');
  const selected = useMemo(() => services.find(item => item.name === service)!, [service]);

  function addAppointment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!client.trim()) return;
    setAppointments(current => [...current, {
      time, client: client.trim(), service, professional, status: 'Pendente',
    }].sort((a, b) => a.time.localeCompare(b.time)));
    setClient('');
    setNotice('Agendamento incluído nesta demonstração.');
    setView('Agenda');
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><img src="/barberly-logo.jpg" alt="Barberly" /></div>
      <div className="shop"><span className="shop-icon">B</span><div><strong>Barbearia Exemplo</strong><small>Interface demonstrativa</small></div></div>
      <p className="nav-label">SEU ESPAÇO</p>
      <nav aria-label="Seções">
        {(['Visão geral', 'Agenda', 'Serviços', 'Profissionais'] as View[]).map(item =>
          <button key={item} className={view === item ? 'active' : ''} onClick={() => { setView(item); setNotice(''); }}>{item}</button>)}
      </nav>
      <p className="sidebar-note">Prévia de interface com dados fictícios e armazenamento apenas durante esta sessão.</p>
    </aside>
    <main className="workspace">
      <header className="topbar"><span>Meu espaço <span className="slash">/</span> <strong>{view}</strong></span><span className="avatar" aria-label="Barbearia Exemplo">BE</span></header>
      <div className="content">
        <div className="page-heading"><div><span className="eyebrow">BARBERLY</span><h1>{view}</h1><p>Uma visão clara da rotina da barbearia.</p></div><button className="primary" onClick={() => setView('Agenda')}>Ver agenda <span aria-hidden="true">→</span></button></div>
        {notice && <p className="notice" role="status">{notice}</p>}
        {view === 'Visão geral' && <>
          <div className="metrics"><article><span>Agendamentos de hoje</span><strong>{appointments.length}</strong><small>Horários na agenda</small></article><article><span>Serviços cadastrados</span><strong>{services.length}</strong><small>Opções para clientes</small></article><article><span>Profissionais</span><strong>{professionals.length}</strong><small>Equipe disponível</small></article></div>
          <section className="panel"><div className="section-heading"><div><span className="eyebrow">HOJE</span><h2>Próximos agendamentos</h2></div><button className="text-button" onClick={() => setView('Agenda')}>Abrir agenda →</button></div><AppointmentList items={appointments.slice(0, 3)} /></section>
        </>}
        {view === 'Agenda' && <div className="grid-two"><section className="panel"><div className="section-heading"><div><span className="eyebrow">AGENDA</span><h2>Horários</h2></div></div><AppointmentList items={appointments} /></section><section className="panel"><div className="section-heading"><div><span className="eyebrow">NOVO HORÁRIO</span><h2>Adicionar agendamento</h2></div></div><form onSubmit={addAppointment}><label>Cliente<input value={client} onChange={event => setClient(event.target.value)} placeholder="Nome do cliente" required /></label><label>Serviço<select value={service} onChange={event => setService(event.target.value)}>{services.map(item => <option key={item.name}>{item.name}</option>)}</select></label><label>Profissional<select value={professional} onChange={event => setProfessional(event.target.value)}>{professionals.map(item => <option key={item}>{item}</option>)}</select></label><label>Horário<select value={time} onChange={event => setTime(event.target.value)}>{slots.map(item => <option key={item}>{item}</option>)}</select></label><div className="form-total"><span>Serviço selecionado</span><strong>{money(selected.price)}</strong></div><button className="primary" type="submit">Adicionar à agenda</button></form></section></div>}
        {view === 'Serviços' && <section className="panel"><div className="section-heading"><div><span className="eyebrow">CATÁLOGO</span><h2>Serviços</h2></div></div><div className="service-list">{services.map(item => <article key={item.name}><div className="service-icon">✂</div><div><strong>{item.name}</strong><small>{item.minutes} minutos</small></div><b>{money(item.price)}</b></article>)}</div></section>}
        {view === 'Profissionais' && <section className="panel"><div className="section-heading"><div><span className="eyebrow">EQUIPE</span><h2>Profissionais</h2></div></div><div className="team-list">{professionals.map(item => <article key={item}><span className="person-icon">{item.slice(0, 1)}</span><div><strong>{item}</strong><small>Agenda disponível</small></div></article>)}</div></section>}
      </div>
    </main>
  </div>;
}

function AppointmentList({ items }: { items: typeof initialAppointments }) {
  return <div className="appointment-list">{items.map((item, index) => <article key={`${item.client}-${index}`}><time>{item.time}</time><div><strong>{item.client}</strong><small>{item.service} · {item.professional}</small></div><span className={item.status === 'Confirmado' ? 'status confirmed' : 'status'}>{item.status}</span></article>)}</div>;
}
