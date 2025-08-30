// multi-tomatbar.js - Functions for "تومەتبار" form

let personCount = 1; // Track number of person cards

document.addEventListener('DOMContentLoaded', () => {
  // Initialize form if we're on the tomary-tomatbar page
  const multiTomatbarForm = document.getElementById('multi-tomatbar-form');
  if (!multiTomatbarForm) return;
  
  // Setup initial person card
  setupPersonCard(1);
  
  // Setup add person button
  const addPersonButton = document.getElementById('add-person-button');
  if (addPersonButton) {
    addPersonButton.addEventListener('click', addPersonCard);
  }
  
  // Setup form submission
  multiTomatbarForm.addEventListener('submit', handleFormSubmit);
  
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
      <h3 class="person-card-title">بيانات المتهم ${personCount}</h3>
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
      <!-- Additional fields for tomatbar -->
      <div class="form-group">
        <label for="marital-status-${personCount}">الحالة الاجتماعية:</label>
        <input type="text" id="marital-status-${personCount}" name="marital-status-${personCount}" class="form-control" list="marital-status-options" />
      </div>
      <div class="form-group">
        <label for="occupation-${personCount}">المهنة:</label>
        <input type="text" id="occupation-${personCount}" name="occupation-${personCount}" class="form-control" />
      </div>
      <div class="form-group">
        <label for="imprisonment-${personCount}">محكوم بالسجن؟</label>
        <input type="text" id="imprisonment-${personCount}" name="imprisonment-${personCount}" class="form-control" list="imprisonment-options" />
      </div>
      <div class="form-group">
        <label for="id-number-${personCount}">رقم الهوية:</label>
        <input type="text" id="id-number-${personCount}" name="id-number-${personCount}" class="form-control" />
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
      cardTitle.textContent = `بيانات المتهم ${newIndex}`;
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
  const requiredInputs = document.querySelectorAll('#multi-tomatbar-form [required]');
  
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
      phone: document.getElementById(`phone-${i}`)?.value,
      
      // Additional tomatbar fields
      maritalStatus: document.getElementById(`marital-status-${i}`)?.value,
      occupation: document.getElementById(`occupation-${i}`)?.value,
      imprisonment: document.getElementById(`imprisonment-${i}`)?.value,
      idNumber: document.getElementById(`id-number-${i}`)?.value
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
  const form = document.getElementById('multi-tomatbar-form');
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
  
  // Create card content with a more compact, elegant design
  let cardContent = `
    <div class="record-card-header" style="background-color: #3498db; color: white; border-radius: 10px 10px 0 0; padding: 10px 15px; display: flex; justify-content: space-between; align-items: center;">
      <h3 class="record-card-title" style="margin: 0;">${record.issueType || 'بلاغ'}</h3>
      <p class="record-card-date" style="margin: 0; font-size: 14px;">${formatDate(record.timestamp)}</p>
    </div>
    <div class="record-card-body" style="border: 1px solid #e0e0e0; border-width: 0 1px 1px 1px; border-radius: 0 0 10px 10px; padding: 15px; box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);">
  `;
  
  // Add issue details section - more compact and elegant design
  cardContent += `
    <div class="record-card-section" style="margin-bottom: 15px;">
      <div class="section-header" style="color: white; background-color: #2c3e50; font-size: 16px; padding: 8px 15px; border-radius: 5px; margin-bottom: 10px; display: flex; align-items: center;">
        <i class="fas fa-info-circle" style="margin-left: 8px;"></i>معلومات القضية
      </div>
      <div class="section-body" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
        <div class="info-group" style="background-color: #f8f9fa; border-radius: 5px; padding: 8px; border-right: 3px solid #3498db;">
          <div style="display: flex; align-items: center;">
            <div class="info-label" style="font-weight: bold; color: #555; font-size: 14px; margin-left: 8px;">نوع المشكلة:</div>
            <div class="info-value" style="font-size: 14px;">${record.issueType || '-'}</div>
          </div>
        </div>
        <div class="info-group" style="background-color: #f8f9fa; border-radius: 5px; padding: 8px; border-right: 3px solid #3498db;">
          <div style="display: flex; align-items: center;">
            <div class="info-label" style="font-weight: bold; color: #555; font-size: 14px; margin-left: 8px;">الوقت:</div>
            <div class="info-value" style="font-size: 14px;">${record.timeFrom || '-'} إلى ${record.timeTo || '-'}</div>
          </div>
        </div>
        <div class="info-group" style="background-color: #f8f9fa; border-radius: 5px; padding: 8px; border-right: 3px solid #3498db;">
          <div style="display: flex; align-items: center;">
            <div class="info-label" style="font-weight: bold; color: #555; font-size: 14px; margin-left: 8px;">الفترة:</div>
            <div class="info-value" style="font-size: 14px;">${record.period || '-'}</div>
          </div>
        </div>
        <div class="info-group" style="background-color: #f8f9fa; border-radius: 5px; padding: 8px; border-right: 3px solid #3498db;">
          <div style="display: flex; align-items: center;">
            <div class="info-label" style="font-weight: bold; color: #555; font-size: 14px; margin-left: 8px;">المكان:</div>
            <div class="info-value" style="font-size: 14px;">${record.location || '-'}</div>
          </div>
        </div>
        <div class="info-group" style="background-color: #f8f9fa; border-radius: 5px; padding: 8px; border-right: 3px solid #3498db;">
          <div style="display: flex; align-items: center;">
            <div class="info-label" style="font-weight: bold; color: #555; font-size: 14px; margin-left: 8px;">اسم السائق:</div>
            <div class="info-value" style="font-size: 14px;">${record.driverName || '-'}</div>
          </div>
        </div>
        <div class="info-group" style="background-color: #f8f9fa; border-radius: 5px; padding: 8px; border-right: 3px solid #3498db;">
          <div style="display: flex; align-items: center;">
            <div class="info-label" style="font-weight: bold; color: #555; font-size: 14px; margin-left: 8px;">النقطة:</div>
            <div class="info-value" style="font-size: 14px;">${record.point || '-'}</div>
          </div>
        </div>
        <div class="info-group" style="background-color: #f8f9fa; border-radius: 5px; padding: 8px; border-right: 3px solid #3498db;">
          <div style="display: flex; align-items: center;">
            <div class="info-label" style="font-weight: bold; color: #555; font-size: 14px; margin-left: 8px;">تمت الإحالة إلى:</div>
            <div class="info-value" style="font-size: 14px;">${record.sentTo || '-'}</div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add persons information - more compact and elegant design
  if (record.persons && record.persons.length > 0) {
    cardContent += `
      <div class="record-card-section" style="margin-bottom: 15px;">
        <div class="section-header" style="color: white; background-color: #2c3e50; font-size: 16px; padding: 8px 15px; border-radius: 5px; margin-bottom: 10px; display: flex; align-items: center;">
          <i class="fas fa-users" style="margin-left: 8px;"></i>بيانات الأشخاص (${record.persons.length})
        </div>
        <div class="section-body" style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: space-between;">
    `;
    
    record.persons.forEach((person, index) => {
      cardContent += `
        <div class="person-info" style="display: flex; flex-direction: row; justify-content: space-between; width: 100%; background-color: white; border-radius: 5px; padding: 10px; margin-bottom: 10px; border-right: 3px solid #3498db; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
          <h5 style="width: 100%; margin: 0 0 10px 0; color: #3498db; font-size: 16px; display: flex; align-items: center;"><i class="fas fa-user" style="margin-left: 8px;"></i>الشخص ${index + 1}: ${person.type || '-'}</h5>
      `;
      
      // Add photo and person details in a more compact horizontal layout
      cardContent += `<div class="person-photo" style="flex: 0 0 80px; margin-left: 10px;">`;
      
      // Add photo if available - more compact and elegant
      if (person.photoData) {
        cardContent += `
          <div class="person-photo-container" style="border-radius: 50%; overflow: hidden; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); border: 2px solid #3498db; width: 70px; height: 70px;">
            <img src="${person.photoData}" alt="صورة الشخص" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
          </div>
        `;
      } else {
        cardContent += `
          <div class="person-photo-container" style="border-radius: 50%; overflow: hidden; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); border: 2px solid #3498db; width: 70px; height: 70px; display: flex; justify-content: center; align-items: center; background-color: #f8f9fa;">
            <span style="font-size: 20px; color: #3498db;"><i class="fas fa-user"></i></span>
          </div>
        `;
      }
      
      cardContent += `</div>`;
      
      // Person details in a more compact grid layout
      cardContent += `<div class="person-details" style="flex: 1; display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 5px;">`;

      
      cardContent += `
        <div class="info-group" style="background-color: #f8f9fa; border-radius: 5px; padding: 5px; margin: 2px;">
          <div style="display: flex; align-items: center;">
            <div class="info-label" style="font-weight: bold; color: #555; font-size: 13px; margin-left: 5px;">الاسم:</div>
            <div class="info-value" style="font-size: 13px;">${person.fullName || '-'}</div>
          </div>
        </div>
        <div class="info-group" style="background-color: #f8f9fa; border-radius: 5px; padding: 5px; margin: 2px;">
          <div style="display: flex; align-items: center;">
            <div class="info-label" style="font-weight: bold; color: #555; font-size: 13px; margin-left: 5px;">الميلاد:</div>
            <div class="info-value" style="font-size: 13px;">${person.birthYear || '-'}</div>
          </div>
        </div>
        <div class="info-group" style="background-color: #f8f9fa; border-radius: 5px; padding: 5px; margin: 2px;">
          <div style="display: flex; align-items: center;">
            <div class="info-label" style="font-weight: bold; color: #555; font-size: 13px; margin-left: 5px;">العنوان:</div>
            <div class="info-value" style="font-size: 13px;">${person.address || '-'}</div>
          </div>
        </div>
        <div class="info-group" style="background-color: #f8f9fa; border-radius: 5px; padding: 5px; margin: 2px;">
          <div style="display: flex; align-items: center;">
            <div class="info-label" style="font-weight: bold; color: #555; font-size: 13px; margin-left: 5px;">الهاتف:</div>
            <div class="info-value" style="font-size: 13px;">${person.phone || '-'}</div>
          </div>
        </div>
      `;
      
      // Add tomatbar specific fields if they exist - more compact design
      if (person.maritalStatus || person.occupation || person.imprisonment || person.idNumber) {
        cardContent += `
          <div class="info-group" style="background-color: #f8f9fa; border-radius: 5px; padding: 5px; margin: 2px;">
            <div style="display: flex; align-items: center;">
              <div class="info-label" style="font-weight: bold; color: #555; font-size: 13px; margin-left: 5px;">الحالة:</div>
              <div class="info-value" style="font-size: 13px;">${person.maritalStatus || '-'}</div>
            </div>
          </div>
          <div class="info-group" style="background-color: #f8f9fa; border-radius: 5px; padding: 5px; margin: 2px;">
            <div style="display: flex; align-items: center;">
              <div class="info-label" style="font-weight: bold; color: #555; font-size: 13px; margin-left: 5px;">المهنة:</div>
              <div class="info-value" style="font-size: 13px;">${person.occupation || '-'}</div>
            </div>
          </div>
          <div class="info-group" style="background-color: #f8f9fa; border-radius: 5px; padding: 5px; margin: 2px;">
            <div style="display: flex; align-items: center;">
              <div class="info-label" style="font-weight: bold; color: #555; font-size: 13px; margin-left: 5px;">السجن:</div>
              <div class="info-value" style="font-size: 13px;">${person.imprisonment || '-'}</div>
            </div>
          </div>
          <div class="info-group" style="background-color: #f8f9fa; border-radius: 5px; padding: 5px; margin: 2px;">
            <div style="display: flex; align-items: center;">
              <div class="info-label" style="font-weight: bold; color: #555; font-size: 13px; margin-left: 5px;">الهوية:</div>
              <div class="info-value" style="font-size: 13px;">${person.idNumber || '-'}</div>
            </div>
          </div>
        `;
      }
      
      // Close person-details and person-info divs
      cardContent += `
          </div>
        </div>
      `;
    });
    
    // Close section-body and record-card-section divs
    cardContent += `
        </div>
      </div>
    `;
  }
  
  // Add notes if available - more compact and elegant design
  if (record.notes) {
    cardContent += `
      <div class="record-card-section" style="margin-bottom: 15px;">
        <div class="section-header" style="color: white; background-color: #2c3e50; font-size: 16px; padding: 8px 15px; border-radius: 5px; margin-bottom: 10px; display: flex; align-items: center;">
          <i class="fas fa-sticky-note" style="margin-left: 8px;"></i>ملاحظات
        </div>
        <div class="section-body">
          <div class="info-group" style="width: 100%;">
            <div class="info-value" style="padding: 8px; background-color: #f8f9fa; border-radius: 5px; border-right: 3px solid #3498db; font-size: 14px; line-height: 1.4;">${record.notes}</div>
          </div>
        </div>
      </div>
    `;
  }
  
  // Add footer with timestamp - more compact and elegant design
  cardContent += `
    </div>
    <div class="record-card-footer" style="background-color: #3498db; color: white; padding: 8px; text-align: center; font-size: 12px; border-radius: 0 0 10px 10px; display: flex; justify-content: space-between; align-items: center;">
      <span><i class="fas fa-calendar-alt" style="margin-left: 5px;"></i>تاريخ الإنشاء: ${formatDate(record.timestamp)}</span>
      <span><i class="fas fa-check-circle"></i></span>
    </div>
  `;
  
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