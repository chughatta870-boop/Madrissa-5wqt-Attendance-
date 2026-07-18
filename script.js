let students = JSON.parse(localStorage.getItem('students')) || [];
let attendance = JSON.parse(localStorage.getItem('attendance')) || {};
const prayers = ['Fajar','Zuhar','Asar','Maghrib','Isha'];

document.getElementById('attendanceDate').valueAsDate = new Date();

// Modal Controls
document.getElementById('addStudentBtn').onclick = () => document.getElementById('modal').style.display='flex';
document.getElementById('closeModalBtn').onclick = () => document.getElementById('modal').style.display='none';

document.getElementById('saveStudentBtn').onclick = () => {
  const roll = document.getElementById('rollNo').value;
  const name = document.getElementById('studentName').value;
  const father = document.getElementById('fatherName').value;
  if(roll && name && father){
    if(students.find(s=>s.roll==roll)){ alert('Roll No already exists!'); return; }
    students.push({roll, name, father, section: document.getElementById('sectionSelect').value});
    localStorage.setItem('students', JSON.stringify(students));
    loadStudents();
    document.getElementById('modal').style.display='none';
    document.getElementById('rollNo').value = '';
    document.getElementById('studentName').value = '';
    document.getElementById('fatherName').value = '';
  }
}

function loadStudents(){
  const section = document.getElementById('sectionSelect').value;
  const date = document.getElementById('attendanceDate').value;
  const tbody = document.getElementById('studentList');
  tbody.innerHTML = '';
  students.filter(s=>s.section==section).forEach(s=>{
    let prayerBtns = '';
    prayers.forEach(p=>{
      const status = attendance[date]?.[s.roll]?.[p] || '';
      prayerBtns += `
        <td>
          <button class="att-btn present ${status=='P'?'active':''}" onclick="mark('${s.roll}','${p}','P')">P</button>
          <button class="att-btn absent ${status=='A'?'active':''}" onclick="mark('${s.roll}','${p}','A')">A</button>
          <button class="att-btn leave ${status=='L'?'active':''}" onclick="mark('${s.roll}','${p}','L')">L</button>
        </td>`;
    });

    tbody.innerHTML += `
    <tr>
      <td>${s.roll}</td>
      <td>${s.name}</td>
      <td>${s.father}</td>
      ${prayerBtns}
      <td>
        <button class="edit-btn" onclick="editStudent('${s.roll}')">Edit</button>
        <button class="del-btn" onclick="deleteStudent('${s.roll}')">Del</button>
      </td>
    </tr>`;
  });
}

function mark(roll, prayer, status){
  const date = document.getElementById('attendanceDate').value;
  if(!attendance[date]) attendance[date] = {};
  if(!attendance[date][roll]) attendance[date][roll] = {};
  attendance[date][roll][prayer] = status;
  localStorage.setItem('attendance', JSON.stringify(attendance));
  loadStudents();
}

function deleteStudent(roll){
  if(confirm('کیا آپ واقعی اس طالب علم کو حذف کرنا چاہتے ہیں؟')){
    students = students.filter(s=>s.roll!=roll);
    localStorage.setItem('students', JSON.stringify(students));
    loadStudents();
  }
}

function editStudent(roll){
  const s = students.find(x=>x.roll==roll);
  document.getElementById('rollNo').value = s.roll;
  document.getElementById('studentName').value = s.name;
  document.getElementById('fatherName').value = s.father;
  deleteStudent(roll);
  document.getElementById('modal').style.display='flex';
}

// Save, Download, Share
document.getElementById('saveBtn').onclick = () => alert('Data Save ho gaya!');

document.getElementById('downloadBtn').onclick = () => {
  let csv = "Roll No,Name,Father,Date,Section,Fajar,Zuhar,Asar,Maghrib,Isha,Madrissa\n";
  const date = document.getElementById('attendanceDate').value;
  const section = document.getElementById('sectionSelect').value;
  const madrissa = document.getElementById('madrissaName').value;
  students.filter(s=>s.section==section).forEach(s=>{
    let row = `${s.roll},${s.name},${s.father},${date},${section},`;
    prayers.forEach(p=> row += `${attendance[date]?.[s.roll]?.[p]||''},`);
    row += `${madrissa}\n`;
    csv += row;
  });
  const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `5Wqt_Attendance_${date}_${section}.csv`;
  a.click();
}

document.getElementById('shareBtn').onclick = async () => {
  const text = `5 Wqt Attendance Report - ${document.getElementById('attendanceDate').value} - ${document.getElementById('madrissaName').value}`;
  if(navigator.share){
    navigator.share({title: 'Madrissa Attendance', text: text});
  } else {
    alert('Share: ' + text);
  }
}

document.getElementById('sectionSelect').onchange = loadStudents;
document.getElementById('attendanceDate').onchange = loadStudents;
loadStudents();
