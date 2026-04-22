import { useState } from 'react';
import type { Period } from './types';
import { mockDashboard } from './data/mockDashboard';
import { TimeToggle } from './components/TimeToggle';
import { CompanyCard } from './components/CompanyCard';
import { TeamCard } from './components/TeamCard';
import './App.css';

export default function App() {
  const [period, setPeriod] = useState<Period>('month');
  const [expandedId, setExpandedId] = useState<'a' | 'b' | null>(null);

  const toggle = (id: 'a' | 'b') => setExpandedId(prev => (prev === id ? null : id));

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Goose Helper</h1>
          <div className="subtitle">Labor Utilization · Executive View</div>
        </div>
        <TimeToggle value={period} onChange={setPeriod} />
      </header>

      <main className="app-main">
        <CompanyCard data={mockDashboard} period={period} />

        <div className={`team-grid ${expandedId ? 'has-expanded' : ''}`}>
          {mockDashboard.teams.map(team => {
            if (expandedId && expandedId !== team.id) return null;
            return (
              <TeamCard
                key={team.id}
                team={team}
                period={period}
                expanded={expandedId === team.id}
                onToggle={() => toggle(team.id)}
              />
            );
          })}
        </div>
      </main>

      <footer className="app-footer">
        Prototype · mock data · pull-only view
      </footer>
    </div>
  );
}
