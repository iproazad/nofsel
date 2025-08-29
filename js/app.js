// app.js - Common functions for Misconduct Logger App

// Constants
const STORAGE_KEY = 'tomaryAresheRecords';

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
  // Register service worker for PWA functionality
  registerServiceWorker();
  
  // Load combobox options if needed
  loadComboboxOptions();
});

// Register Service Worker
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js')
        .then(registration => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        })
        .catch(error => {
          console.log('ServiceWorker registration failed: ', error);
        });
    });
  }
}

// Load Combobox Options from JSON
async function loadComboboxOptions() {
  try {
    const response = await fetch('./js/combobox_options.json');
    const options = await response.json();
    
    // Populate datalists if they exist on the page
    populateDatalist('issue-type-options', options.issue_types);
    populateDatalist('period-list', options.periods);
    populateDatalist('point-list', options.points);
    populateDatalist('sent-to-list', options.sent_to);
    populateDatalist('driver-list', options.drivers);
    populateDatalist('marital-status-options', options.marital_status);
    populateDatalist('imprisonment-options', options.imprisonment);
    
    // Populate select elements if they exist
    populateSelectElements();
    
  } catch (error) {
    console.error('Error loading combobox options:', error);
  }
}

// Populate datalist with options
function populateDatalist(datalistId, options) {
  const datalist = document.getElementById(datalistId);
  if (!datalist) return;
  
  // Clear existing options
  datalist.innerHTML = '';
  
  // Add new options
  options.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option;
    datalist.appendChild(optionElement);
  });
}

// Populate select elements with person types
function populateSelectElements() {
  fetch('./js/combobox_options.json')
    .then(response => response.json())
    .then(options => {
      // Find all person-type select elements
      document.querySelectorAll('select[id^="person-type-"]').forEach(select => {
        // Clear existing options
        select.innerHTML = '';
        
        // Add new options
        options.person_types.forEach(option => {
          const optionElement = document.createElement('option');
          optionElement.value = option;
          optionElement.textContent = option;
          select.appendChild(optionElement);
        });
      });
    })
    .catch(error => console.error('Error populating select elements:', error));
}

// Save record to local storage
function saveRecord(record) {
  // Get existing records
  const records = getRecords();
  
  // Add timestamp and unique ID
  record.timestamp = new Date().toISOString();
  record.id = generateUniqueId();
  
  // Add new record
  records.push(record);
  
  // Save back to local storage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  
  return record;
}

// Get all records from local storage
function getRecords() {
  const records = localStorage.getItem(STORAGE_KEY);
  return records ? JSON.parse(records) : [];
}

// Get a specific record by ID
function getRecordById(id) {
  const records = getRecords();
  return records.find(record => record.id === id);
}

// Delete a record by ID
function deleteRecord(id) {
  let records = getRecords();
  records = records.filter(record => record.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

// Generate a unique ID
function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ar-IQ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Share record via WhatsApp
function shareViaWhatsApp(text) {
  // Encode the text for URL
  const encodedText = encodeURIComponent(text);
  
  // Create WhatsApp URL
  const whatsappUrl = `https://wa.me/?text=${encodedText}`;
  
  // Open in new window
  window.open(whatsappUrl, '_blank');
}

// Format record for WhatsApp sharing
function formatRecordForWhatsApp(record) {
  let text = "*تسجيل المتهم والمشاكل*\n\n";
  
  // Add issue details
  text += "*تفاصيل البلاغ:*\n";
  if (record.issueType) text += `نوع المشكلة: ${record.issueType}\n`;
  if (record.timeFrom) text += `الوقت من: ${record.timeFrom}\n`;
  if (record.timeTo) text += `الوقت إلى: ${record.timeTo}\n`;
  if (record.period) text += `الفترة: ${record.period}\n`;
  if (record.location) text += `المكان: ${record.location}\n`;
  if (record.driverName) text += `اسم السائق: ${record.driverName}\n`;
  if (record.point) text += `النقطة: ${record.point}\n`;
  if (record.sentTo) text += `تمت الإحالة إلى: ${record.sentTo}\n`;
  
  // Add persons information
  if (record.persons && record.persons.length > 0) {
    text += "\n*معلومات الأشخاص:*\n";
    
    record.persons.forEach((person, index) => {
      text += `\n*الشخص ${index + 1}:*\n`;
      if (person.type) text += `النوع: ${person.type}\n`;
      if (person.fullName) text += `الاسم: ${person.fullName}\n`;
      if (person.birthYear) text += `سنة الميلاد: ${person.birthYear}\n`;
      if (person.address) text += `العنوان: ${person.address}\n`;
      if (person.phone) text += `الهاتف: ${person.phone}\n`;
      
      // Add tomatbar specific fields if they exist
      if (person.maritalStatus) text += `الحالة الاجتماعية: ${person.maritalStatus}\n`;
      if (person.occupation) text += `المهنة: ${person.occupation}\n`;
      if (person.imprisonment) text += `محكوم بالسجن: ${person.imprisonment}\n`;
      if (person.idNumber) text += `رقم الهوية: ${person.idNumber}\n`;
    });
  }
  
  // Add notes if available
  if (record.notes) {
    text += "\n*ملاحظات:*\n";
    text += `${record.notes}\n`;
  }
  
  // Add timestamp
  if (record.timestamp) {
    text += "\n*تاريخ التسجيل:* ";
    text += formatDate(record.timestamp);
  }
  
  return text;
}

// Handle photo input and preview
function setupPhotoInput(inputId, previewId) {
  const photoInput = document.getElementById(inputId);
  const photoPreview = document.getElementById(previewId);
  
  if (!photoInput || !photoPreview) return;
  
  photoInput.addEventListener('change', function() {
    if (this.files && this.files[0]) {
      const reader = new FileReader();
      
      reader.onload = function(e) {
        photoPreview.src = e.target.result;
        photoPreview.style.display = 'block';
      };
      
      reader.readAsDataURL(this.files[0]);
    }
  });
}

// Convert record card to image and download
function saveRecordCardAsImage(cardElement, filename) {
  // Use html2canvas library if available
  if (typeof html2canvas !== 'undefined') {
    html2canvas(cardElement).then(canvas => {
      // Convert canvas to data URL
      const imgData = canvas.toDataURL('image/png');
      
      // Create download link
      const link = document.createElement('a');
      link.download = filename || 'record-card.png';
      link.href = imgData;
      link.click();
    });
  } else {
    console.error('html2canvas library is not loaded');
    alert('لا يمكن حفظ البطاقة كصورة. يرجى التأكد من تحميل مكتبة html2canvas.');
  }
}

// Filter records based on search term
function filterRecords(records, searchTerm) {
  if (!searchTerm) return records;
  
  searchTerm = searchTerm.toLowerCase();
  
  return records.filter(record => {
    // Search in issue details
    if (record.issueType && record.issueType.toLowerCase().includes(searchTerm)) return true;
    if (record.location && record.location.toLowerCase().includes(searchTerm)) return true;
    if (record.driverName && record.driverName.toLowerCase().includes(searchTerm)) return true;
    if (record.notes && record.notes.toLowerCase().includes(searchTerm)) return true;
    
    // Search in persons
    if (record.persons && record.persons.length > 0) {
      return record.persons.some(person => {
        return (
          (person.fullName && person.fullName.toLowerCase().includes(searchTerm)) ||
          (person.address && person.address.toLowerCase().includes(searchTerm)) ||
          (person.phone && person.phone.toLowerCase().includes(searchTerm)) ||
          (person.occupation && person.occupation.toLowerCase().includes(searchTerm)) ||
          (person.idNumber && person.idNumber.toLowerCase().includes(searchTerm))
        );
      });
    }
    
    return false;
  });
}

// Display records in a container element
function displayRecords(records, containerElement) {
  if (!containerElement) return;
  
  // Clear container
  containerElement.innerHTML = '';
  
  if (records.length === 0) {
    containerElement.innerHTML = '<p class="text-center">لا توجد سجلات</p>';
    return;
  }
  
  // Create list of records
  const ul = document.createElement('ul');
  ul.className = 'records-list';
  
  records.forEach(record => {
    const li = document.createElement('li');
    li.className = 'record-item';
    li.dataset.id = record.id;
    
    // Create record summary
    let summary = '';
    
    // Add main person if available
    if (record.persons && record.persons.length > 0) {
      const mainPerson = record.persons[0];
      summary += `<strong>${mainPerson.fullName || 'بدون اسم'}</strong> - `;
    }
    
    // Add issue type and date
    summary += `${record.issueType || 'بدون نوع'}`;
    if (record.timestamp) {
      summary += ` - ${formatDate(record.timestamp)}`;
    }
    
    li.innerHTML = summary;
    
    // Add click event to view record details
    li.addEventListener('click', () => {
      // Dispatch custom event with record ID
      const event = new CustomEvent('viewRecord', { detail: { id: record.id } });
      document.dispatchEvent(event);
    });
    
    ul.appendChild(li);
  });
  
  containerElement.appendChild(ul);
}