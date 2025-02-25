const apiUrl = 'http://localhost:3000/api';

// Show error message
function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  errorElement.textContent = message;
}

// Read file
async function readFile() {
  const fileName = document.getElementById('readFileName').value;
  const errorMessageElement = document.getElementById('readFileError');

  // تحقق إذا كان اسم الملف فارغًا
  if (!fileName) {
    showError('readFileError', "File name is required");
    return;
  }

  // تحقق إذا كان الملف من نوع PDF
  if (!fileName.endsWith('.pdf')) {
    showError('readFileError', "Only PDF files are allowed. Please use a valid PDF file");
    return;
  } else {
    errorMessageElement.textContent = ""; // Clear the error message
  }

  const response = await fetch(`${apiUrl}/read?fileName=${fileName}`);
  
  if (!response.ok) {
    const data = await response.json();
    document.getElementById('readContent').textContent = data.error || 'An error occurred';
  } else {
    const data = await response.json();
    document.getElementById('readContent').textContent = data.content || 'No content found';
  }
}


// Write file
async function writeFile() {
  const fileName = document.getElementById('writeFileName').value;
  const content = document.getElementById('writeContent').value;
  const errorMessageElement = document.getElementById('writeFileError');

  // تحقق من وجود اسم الملف
  if (!fileName || fileName.trim() === "") {
    showError('writeFileError', "File name is required");
    return;
  }

  // تحقق من أن اسم الملف يحتوي على الامتداد .pdf
  if (!fileName.endsWith('.pdf')) {
    showError('writeFileError', "File must have a .pdf extension");
    return;
  }

  // تحقق من أن المحتوى غير فارغ
  if (!content || content.trim() === "") {
    showError('writeFileError', "Content is required");
    return;
  }

  // إذا لم يكن هناك أخطاء، إرسال الطلب
  await fetch(`${apiUrl}/write`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName, content })
  });

  // إزالة رسالة الخطأ إذا كانت موجودة بعد إرسال البيانات بنجاح
  errorMessageElement.textContent = "";
}


// Append file
async function appendFile() {
  const fileName = document.getElementById('appendFileName').value;
  const content = document.getElementById('appendContent').value;

  if (!fileName) {
    showError('appendFileError', "File name is required");
    return;
  }

  if (!content) {
    showError('appendFileError', "Content is required");
    return;
  }

  // إرسال الطلب إلى الخادم
  const response = await fetch(`${apiUrl}/append`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName, content })
  });

  const data = await response.json();

  if (!response.ok) {
    // عرض الخطأ إذا كان الملف غير موجود
    showError('appendFileError', data.error || 'An error occurred');
  } else {
    // إظهار نجاح العملية
    showError('appendFileError', 'Content added successfully');
  }
}

// Delete file
async function deleteFile() {
  const fileName = document.getElementById('deleteFileName').value;

  if (!fileName) {
    showError('deleteFileError', "File name is required");
    return;
  }

  await fetch(`${apiUrl}/delete?fileName=${fileName}`, { method: 'DELETE' });
}

// Rename file
async function renameFile() {
  const oldName = document.getElementById('oldFileName').value;
  const newName = document.getElementById('newFileName').value;

  if (!oldName || !newName) {
    showError('renameFileError', "Both old and new file names are required");
    return;
  }

  await fetch(`${apiUrl}/rename`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ oldName, newName })
  });
}

// Create directory
async function createDirectory() {
  const dirName = document.getElementById('createDirName').value;

  if (!dirName) {
    showError('createDirError', "Directory name is required");
    return;
  }

  await fetch(`${apiUrl}/create-dir`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dirName })
  });
}

// Delete directory
async function deleteDirectory() {
  const dirName = document.getElementById('deleteDirName').value;

  if (!dirName) {
    showError('deleteDirError', "Directory name is required");
    return;
  }

  await fetch(`${apiUrl}/delete-dir?dirName=${dirName}`, { method: 'DELETE' });
}
