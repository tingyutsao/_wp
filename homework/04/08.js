const students = {
  Tom: 85,
  Jerry: 52,
  Emily: 78,
  David: 59
};

const failedStudents = {};

for (let key in students) {
  if (students[key] < 60) {
    failedStudents[key] = students[key];
  }
}

const jsonResult = JSON.stringify(failedStudents);
console.log(jsonResult);