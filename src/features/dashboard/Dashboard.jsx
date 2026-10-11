import Card from '../../components/ui/Card.jsx';
import { TOTAL_DAYS } from '../../data/constants.js';
import { formatINR } from '../../utils/format.js';
import BalanceHero from './BalanceHero.jsx';
import CoachTip from './CoachTip.jsx';
import DayControls from './DayControls.jsx';
import IncomeForm from './IncomeForm.jsx';
import MoneyFlow from './MoneyFlow.jsx';
import ForecastChart from './ForecastChart.jsx';
import QuickLog from './QuickLog.jsx';
import ScoreCard from './ScoreCard.jsx';
import SurpriseCard from './SurpriseCard.jsx';
import WelcomeCard from './WelcomeCard.jsx';
import { actionsShape, metricsShape, stateShape } from '../../types.js';

/** Home screen: balance, forecast, risk and the quick actions that move them. */
export default function Dashboard({ state, metrics, actions }) {
  return (
    <div className="dashboard">
      <div className="dashboard__primary">
        <WelcomeCard />
        <BalanceHero
          balance={state.balance}
          allowance={metrics.dailyAllowance}
          upcoming={metrics.upcomingBills}
          daysLeft={metrics.daysLeft}
        />
        <Card
          title="Month forecast"
          aside={
            <strong className={metrics.forecast < 0 ? 'tone-bad' : 'tone-good'}>
              {formatINR(metrics.forecast)} on day 30
            </strong>
          }
        >
          <ForecastChart history={state.history} day={state.day} balance={state.balance} forecast={metrics.forecast} />
          <p className="muted">Projection assumes about {formatINR(metrics.avgDaily)}/day of everyday spend.</p>
        </Card>
        <SurpriseCard state={state} metrics={metrics} onResolve={actions.resolveSurprise} />
        <DayControls day={state.day} onAdvance={actions.advanceDays} onSurprise={actions.triggerSurprise} />
        {state.day >= TOTAL_DAYS && (
          <Card tone="good" title="Month complete 🎉">
            <p>
              Final balance {formatINR(state.balance)} · saved {formatINR(metrics.totalSaved)} · health {metrics.health}
              /100
            </p>
          </Card>
        )}
      </div>
      <div className="dashboard__secondary">
        <ScoreCard metrics={metrics} />
        <CoachTip metrics={metrics} />
        <QuickLog onLog={actions.logSpend} />
        <IncomeForm onAdd={actions.addIncome} />
        <MoneyFlow flow={metrics.flow} balance={state.balance} />
      </div>
    </div>
  );
}

Dashboard.propTypes = {
  state: stateShape.isRequired,
  metrics: metricsShape.isRequired,
  actions: actionsShape.isRequired,
};
