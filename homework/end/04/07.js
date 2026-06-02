const jsonString = '[{"name":"Alex","dept":"IT","salary":60000},{"name":"Bob","dept":"HR","salary":45000},{"name":"Chris","dept":"IT","salary":55000}]';

const employees = JSON.parse(jsonString);
const highPaidIT = [];

for (let i = 0; i < employees.length; i++) {
  if (employees[i].dept === "IT" && employees[i].salary > 50000) {
    highPaidIT.push(employees[i].name);
  }
}

console.log("符合條件的 IT 員工名單：", highPaidIT);