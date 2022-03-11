import { Card } from '@material-ui/core';
import TransactionsTable, {mapTransactionToData} from './TransactionsTable';
// import AnalyticsTable, {mapTransactionToData} from './AnalyticsTable';
// import AnalyticsBarChart from './AnalyticsBarChart';
// import AnalyticsPieChart from './AnalyticsPieChart';
import { applyFiltering } from './analytics.utils';
// import { applyFiltering, mapTransactionsToBarChartData } from './analytics.utils';
import { pick } from 'ramda';

export default function Transactions ({transactions, filtering, onChangeFiltering}) {

  // const barChartData = mapTransactionsToBarChartData(applyFiltering(pick(['accounts'], filtering), transactions));
  // const pieChartData = applyFiltering(pick(['accounts', 'months'], filtering), transactions);
  const tableData = applyFiltering(pick(['accounts', 'months', 'categories'], filtering), transactions).map(mapTransactionToData);

  return (
    <>
      {/* chart card here */}
      <TransactionsTable data={tableData} style={{marginTop: 24, height: 'calc(100% - 332px - 24px'}}/>
    </>
  )
};
