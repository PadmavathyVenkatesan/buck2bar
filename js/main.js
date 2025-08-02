document.addEventListener('DOMContentLoaded', function () {
  let chartInitialized = false;
  let barChartInstance = null;

  document.getElementById('chart-tab').addEventListener('shown.bs.tab', function () {
    if (chartInitialized) return;
    chartInitialized = true;
    const ctx = document.getElementById('barChart').getContext('2d');
    const data = getMonthlyData();
    barChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ],
        datasets: [
          {
            label: 'Income',
            data: data.income,
            backgroundColor: 'rgba(54, 162, 235, 0.7)'
          },
          {
            label: 'Expense',
            data: data.expense,
            backgroundColor: 'rgba(255, 99, 132, 0.7)'
          }
        ]
      },
      options: {
        responsive: true,
         maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#f8f9fa' } }
        },
        scales: {
          x: { ticks: { color: '#f8f9fa' }, grid: { color: '#444' } },
          y: { ticks: { color: '#f8f9fa' }, grid: { color: '#444' } }
        }
      }
    });

    // Add event listeners to update chart on input change
    document.querySelectorAll('input[name^="income_"], input[name^="expense_"]').forEach(input => {
      input.addEventListener('input', function () {
        const updatedData = getMonthlyData();
        barChartInstance.data.datasets[0].data = updatedData.income;
        barChartInstance.data.datasets[1].data = updatedData.expense;
        barChartInstance.update();
      });
    });
    document.getElementById('downloadChart').addEventListener('click', function () {
    // Only allow download if chart is initialized and has data
    if (barChartInstance && barChartInstance.data.datasets[0].data.some(v => v > 0) || barChartInstance.data.datasets[1].data.some(v => v > 0)) {
        const link = document.createElement('a');
        link.href = barChartInstance.toBase64Image();
        link.download = 'buck2bar-report.png';
        link.click();
    } else {
        alert('Please enter some values to generate the report before downloading.');
    }
    });
  });
});

// Function to retrieve all income and expense values for each month
function getMonthlyData() {
  const months = [
    'jan', 'feb', 'mar', 'apr', 'may', 'jun',
    'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
  ];
  const income = [];
  const expense = [];

  months.forEach(m => {
    const incomeInput = document.querySelector(`input[name="income_${m}"]`);
    const expenseInput = document.querySelector(`input[name="expense_${m}"]`);
    income.push(Number(incomeInput?.value) || 0);
    expense.push(Number(expenseInput?.value) || 0);
  });

  return { income, expense };
}