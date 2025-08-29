// multi-person.js - Functions for "توماری ئاريشە" form

let personCount = 1; // Track number of person cards

document.addEventListener('DOMContentLoaded', () => {
  // Initialize form if we're on the tomary-areshe page
  const multiPersonForm = document.getElementById('multi-person-form');
  if (!multiPersonForm) return;
  
  // Setup initial person card
  setupPersonCard(1);
  
  // Setup add person button
  const addPersonButton = document.getElementById('add-person-button');
  if (addPersonButton) {
    addPersonButton.addEventListener('click', addPersonCard);
  }
  
  // Setup form submission
  multiPersonForm.addEventListener('submit', handleFormSubmit);
  
  // Setup new entry button
  const newEntryButton = document.getElementById('new-entry');
  if (newEntryButton) {
    newEntryButton.addEventListener('click', resetForm);
  }
  
  // Setup WhatsApp share button
  const shareWhatsAppButton = document.getElementById('share-whatsapp');
  if (shareWhatsAppButton) {
    shareWhatsAppButton.addEventListener('click', shareCurrentFormViaWhatsApp);
  }
  
  // Setup show records button
  const showRecordsButton = document.getElementById('show-records-button');
  if (showRecordsButton) {
    showRecordsButton.addEventListener('click', showRecordsModal);
  }
  
  // Setup search input
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', handleSearchInput);
  }
  
  // Listen for view record event
  document.addEventListener('viewRecord', event => {
    const recordId = event.detail.id;
    viewRecordDetails(recordId);
  });
});

// Setup a person card with given index
function setupPersonCard(index) {
  // Setup photo input and preview
  setupPhotoInput(`photo-input-${index}`, `photo-preview-${index}`);
  
  // Setup remove button if not the first person
  if (index > 1) {
    const removeButton = document.querySelector(`#person-card-${index} .remove-person-btn`);
    if (removeButton) {
      removeButton.addEventListener('click', () => removePersonCard(index));
    }
  }
}

// Add a new person card
function addPersonCard() {
  personCount++;
  
  const personCardsContainer = document.getElementById('person-cards-container');
  if (!personCardsContainer) return;
  
  // Create new person card
  const newCard = document.createElement('div');
  newCard.className = 'person-card';
  newCard.id = `person-card-${personCount}`;
  
  newCard.innerHTML = `
    <div class="person-card-header">
      <h3 class="person-card-title">بيانات الشخص ${personCount}</h3>
      <button type="button" class="remove-person-btn" title="إزالة الشخص">&times;</button>
    </div>
    <div class="person-card-body">
      <div class="form-group">
        <label for="photo-input-${personCount}">الصورة:</label>
        <div class="person-photo-container">
          <img id="photo-preview-${personCount}" class="person-photo-preview" alt="معاينة الصورة" />
        </div>
        <input type="file" id="photo-input-${personCount}" name="photo-input-${personCount}" accept="image/*" class="form-control" />
      </div>
      <div class="form-group">
        <label for="person-type-${personCount}">نوع الشخص:</label>
        <select id="person-type-${personCount}" name="person-type-${personCount}" class="form-control" required>
          <option value="اختر نوع الشخص">اختر نوع الشخص</option>
          <option value="مشتەكی">مشتەكی</option>
          <option value="تاوانبار">تاوانبار</option>
        </select>
      </div>
      <div class="form-group">
        <label for="fullname-${personCount}">الاسم الكامل:</label>
        <input type="text" id="fullname-${personCount}" name="fullname-${personCount}" class="form-control" required />
      </div>
      <div class="form-group">
        <label for="birthdate-${personCount}">سنة الميلاد:</label>
        <input type="number" id="birthdate-${personCount}" name="birthdate-${personCount}" class="form-control" min="1900" max="2024" required />
      </div>
      <div class="form-group">
        <label for="address-${personCount}">العنوان:</label>
        <input type="text" id="address-${personCount}" name="address-${personCount}" class="form-control" required />
      </div>
      <div class="form-group">
        <label for="phone-${personCount}">الهاتف:</label>
        <input type="tel" id="phone-${personCount}" name="phone-${personCount}" class="form-control" />
      </div>
    </div>
  `;
  
  personCardsContainer.appendChild(newCard);
  
  // Setup the new card
  setupPersonCard(personCount);
  
  // Renumber person cards
  renumberPersonCards();
}

// Remove a person card
function removePersonCard(index) {
  const cardToRemove = document.getElementById(`person-card-${index}`);
  if (!cardToRemove) return;
  
  cardToRemove.remove();
  renumberPersonCards();
}

// Renumber person cards after adding/removing
function renumberPersonCards() {
  const personCards = document.querySelectorAll('.person-card');
  
  personCards.forEach((card, index) => {
    const newIndex = index + 1;
    
    // Update card ID
    card.id = `person-card-${newIndex}`;
    
    // Update card title
    const cardTitle = card.querySelector('.person-card-title');
    if (cardTitle) {
      cardTitle.textContent = `بيانات الشخص ${newIndex}`;
    }
    
    // Update input IDs and names
    const inputs = card.querySelectorAll('input, select');
    inputs.forEach(input => {
      const oldId = input.id;
      const baseName = oldId.split('-').slice(0, -1).join('-');
      
      input.id = `${baseName}-${newIndex}`;
      input.name = `${baseName}-${newIndex}`;
    });
    
    // Update photo preview ID
    const photoPreview = card.querySelector('.person-photo-preview');
    if (photoPreview) {
      photoPreview.id = `photo-preview-${newIndex}`;
    }
    
    // Update remove button if not the first card
    const removeButton = card.querySelector('.remove-person-btn');
    if (removeButton) {
      // Remove old event listeners
      const newRemoveButton = removeButton.cloneNode(true);
      removeButton.parentNode.replaceChild(newRemoveButton, removeButton);
      
      // Add new event listener if not the first card
      if (newIndex > 1) {
        newRemoveButton.addEventListener('click', () => removePersonCard(newIndex));
      } else {
        newRemoveButton.style.display = 'none';
      }
    }
  });
  
  // Update personCount
  personCount = personCards.length;
}

// Handle form submission
function handleFormSubmit(event) {
  event.preventDefault();
  
  // Validate form
  if (!validateForm()) {
    alert('يرجى ملء جميع الحقول المطلوبة');
    return;
  }
  
  // Collect form data
  const formData = collectFormData();
  
  // Save to local storage
  const savedRecord = saveRecord(formData);
  
  // Show success message
  alert('تم حفظ السجل بنجاح');
  
  // Optionally reset form or redirect
  // resetForm();
}

// Validate form before submission
function validateForm() {
  // Check required fields
  const requiredInputs = document.querySelectorAll('#multi-person-form [required]');
  
  for (const input of requiredInputs) {
    if (!input.value.trim()) {
      input.focus();
      return false;
    }
  }
  
  return true;
}

// Collect all form data
function collectFormData() {
  const formData = {
    // Issue details
    issueType: document.getElementById('issue-type')?.value,
    timeFrom: document.getElementById('time-from')?.value,
    timeTo: document.getElementById('time-to')?.value,
    period: document.getElementById('period')?.value,
    location: document.getElementById('problem-location')?.value,
    driverName: document.getElementById('driver-name')?.value,
    point: document.getElementById('point')?.value,
    sentTo: document.getElementById('sent-to')?.value,
    notes: document.getElementById('notes')?.value,
    
    // Persons array
    persons: []
  };
  
  // Collect person data
  for (let i = 1; i <= personCount; i++) {
    const person = {
      type: document.getElementById(`person-type-${i}`)?.value,
      fullName: document.getElementById(`fullname-${i}`)?.value,
      birthYear: document.getElementById(`birthdate-${i}`)?.value,
      address: document.getElementById(`address-${i}`)?.value,
      phone: document.getElementById(`phone-${i}`)?.value
    };
    
    // Add photo if available
    const photoInput = document.getElementById(`photo-input-${i}`);
    const photoPreview = document.getElementById(`photo-preview-${i}`);
    
    if (photoInput?.files?.[0] && photoPreview?.src) {
      person.photoData = photoPreview.src;
    }
    
    formData.persons.push(person);
  }
  
  return formData;
}

// Reset form to empty state
function resetForm() {
  const form = document.getElementById('multi-person-form');
  if (!form) return;
  
  form.reset();
  
  // Reset person cards
  const personCardsContainer = document.getElementById('person-cards-container');
  if (personCardsContainer) {
    personCardsContainer.innerHTML = '';
  }
  
  // Add first person card back
  personCount = 0;
  addPersonCard();
}

// Share current form data via WhatsApp
function shareCurrentFormViaWhatsApp() {
  // Collect form data
  const formData = collectFormData();
  
  // Format for WhatsApp
  const text = formatRecordForWhatsApp(formData);
  
  // Share via WhatsApp
  shareViaWhatsApp(text);
}

// Show records modal
function showRecordsModal() {
  const modal = document.getElementById('records-modal');
  if (!modal) return;
  
  // Show modal
  modal.style.display = 'block';
  
  // Get records
  const records = getRecords();
  
  // Display records
  const recordsContainer = document.getElementById('records-list-container');
  displayRecords(records, recordsContainer);
  
  // Setup close button
  const closeButton = modal.querySelector('.close-modal');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }
  
  // Close when clicking outside
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
}

// Handle search input
function handleSearchInput() {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;
  
  const searchTerm = searchInput.value.trim();
  
  // Get records
  const records = getRecords();
  
  // Filter records
  const filteredRecords = filterRecords(records, searchTerm);
  
  // Display filtered records
  const recordsContainer = document.getElementById('records-list-container');
  displayRecords(filteredRecords, recordsContainer);
}

// View record details
function viewRecordDetails(recordId) {
  const record = getRecordById(recordId);
  if (!record) return;
  
  const modal = document.getElementById('view-record-modal');
  if (!modal) return;
  
  // Show modal
  modal.style.display = 'block';
  
  // Populate record details
  const recordCard = document.getElementById('record-card');
  if (recordCard) {
    populateRecordCard(recordCard, record);
  }
  
  // Setup close button
  const closeButton = modal.querySelector('.close-modal');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }
  
  // Setup save as image button
  const saveImageButton = document.getElementById('save-record-card');
  if (saveImageButton) {
    saveImageButton.addEventListener('click', () => {
      saveRecordCardAsImage(recordCard, `record-${recordId}.png`);
    });
  }
  
  // Setup WhatsApp share button
  const shareWhatsAppButton = document.getElementById('share-record-whatsapp');
  if (shareWhatsAppButton) {
    shareWhatsAppButton.addEventListener('click', () => {
      shareRecordViaWhatsApp(record);
    });
  }
  
  // Setup delete button
  const deleteButton = document.getElementById('delete-record');
  if (deleteButton) {
    deleteButton.addEventListener('click', () => {
      if (confirm('هل أنت متأكد من حذف هذا السجل؟')) {
        deleteRecord(recordId);
        modal.style.display = 'none';
        
        // Refresh records list
        const recordsContainer = document.getElementById('records-list-container');
        const records = getRecords();
        displayRecords(records, recordsContainer);
      }
    });
  }
  
  // Close when clicking outside
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
}

// Populate record card with record data
function populateRecordCard(cardElement, record) {
  if (!cardElement || !record) return;
  
  // Create card content
  let cardContent = `
    <div class="record-card-header">
      <h3 class="record-card-title">${record.issueType || 'بلاغ'}</h3>
      <p>${formatDate(record.timestamp)}</p>
    </div>
    <div class="record-card-body">
  `;
  
  // Add issue details
  cardContent += `
    <div class="info-group">
      <div class="info-label">نوع المشكلة:</div>
      <div class="info-value">${record.issueType || '-'}</div>
    </div>
    <div class="info-group">
      <div class="info-label">الوقت:</div>
      <div class="info-value">${record.timeFrom || '-'} إلى ${record.timeTo || '-'}</div>
    </div>
    <div class="info-group">
      <div class="info-label">الفترة:</div>
      <div class="info-value">${record.period || '-'}</div>
    </div>
    <div class="info-group">
      <div class="info-label">المكان:</div>
      <div class="info-value">${record.location || '-'}</div>
    </div>
    <div class="info-group">
      <div class="info-label">اسم السائق:</div>
      <div class="info-value">${record.driverName || '-'}</div>
    </div>
    <div class="info-group">
      <div class="info-label">النقطة:</div>
      <div class="info-value">${record.point || '-'}</div>
    </div>
    <div class="info-group">
      <div class="info-label">تمت الإحالة إلى:</div>
      <div class="info-value">${record.sentTo || '-'}</div>
    </div>
  `;
  
  // Add persons information
  if (record.persons && record.persons.length > 0) {
    cardContent += `<div class="info-group" style="flex-basis: 100%;"><h4>معلومات الأشخاص:</h4></div>`;
    
    record.persons.forEach((person, index) => {
      cardContent += `
        <div class="info-group" style="flex-basis: 100%; border-top: 1px solid #ddd; padding-top: 10px; margin-top: 10px;">
          <h5>الشخص ${index + 1}: ${person.type || '-'}</h5>
        </div>
      `;
      
      // Add photo if available
      if (person.photoData) {
        cardContent += `
          <div class="info-group">
            <div class="person-photo-container" style="width: 100px; height: 100px;">
              <img src="${person.photoData}" alt="صورة الشخص" style="max-width: 100%; max-height: 100%; display: block;" />
            </div>
          </div>
        `;
      }
      
      cardContent += `
        <div class="info-group">
          <div class="info-label">الاسم الكامل:</div>
          <div class="info-value">${person.fullName || '-'}</div>
        </div>
        <div class="info-group">
          <div class="info-label">سنة الميلاد:</div>
          <div class="info-value">${person.birthYear || '-'}</div>
        </div>
        <div class="info-group">
          <div class="info-label">العنوان:</div>
          <div class="info-value">${person.address || '-'}</div>
        </div>
        <div class="info-group">
          <div class="info-label">الهاتف:</div>
          <div class="info-value">${person.phone || '-'}</div>
        </div>
      `;
    });
  }
  
  // Add notes if available
  if (record.notes) {
    cardContent += `
      <div class="info-group" style="flex-basis: 100%;">
        <div class="info-label">ملاحظات:</div>
        <div class="info-value">${record.notes}</div>
      </div>
    `;
  }
  
  cardContent += `</div>`; // Close record-card-body
  
  // Set card content
  cardElement.innerHTML = cardContent;
}

// Share record via WhatsApp
function shareRecordViaWhatsApp(record) {
  if (!record) return;
  
  // Format for WhatsApp
  const text = formatRecordForWhatsApp(record);
  
  // Share via WhatsApp
  shareViaWhatsApp(text);
}