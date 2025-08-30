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
  
  // Create card content with a single frame
  let cardContent = `
    <div class="record-card-header" style="border-bottom: 2px solid #3498db; margin-bottom: 15px;">
      <h3 class="record-card-title">${record.issueType || 'بلاغ'}</h3>
      <p class="record-card-date">${formatDate(record.timestamp)}</p>
    </div>
    <div class="record-card-body" style="border: 1px solid #e0e0e0; border-radius: 10px; padding: 15px; box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);">
  `;
  
  // Add issue details section - separated at the beginning with labels next to values
  cardContent += `
    <div class="record-card-section" style="background-color: #f8f9fa; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
      <div class="section-header" style="color: #2c3e50; font-size: 20px; margin-bottom: 15px;">معلومات القضية</div>
      <div class="section-body" style="display: flex; flex-wrap: wrap; justify-content: space-between;">
        <div class="info-group" style="flex: 1 0 30%; min-width: 150px; padding: 0 10px; margin-bottom: 10px;">
          <div style="display: flex; align-items: center;">
            <div class="info-label" style="margin-bottom: 0; margin-left: 10px; min-width: 100px;">نوع المشكلة:</div>
            <div class="info-value" style="padding: 5px 0; font-weight: 500;">${record.issueType || '-'}</div>
          </div>
        </div>
        <div class="info-group" style="flex: 1 0 30%; min-width: 150px; padding: 0 10px; margin-bottom: 10px;">
          <div style="display: flex; align-items: center;">
            <div class="info-label" style="margin-bottom: 0; margin-left: 10px; min-width: 100px;">الوقت:</div>
            <div class="info-value" style="padding: 5px 0; font-weight: 500;">${record.timeFrom || '-'} إلى ${record.timeTo || '-'}</div>
          </div>
        </div>
        <div class="info-group" style="flex: 1 0 30%; min-width: 150px; padding: 0 10px; margin-bottom: 10px;">
          <div style="display: flex; align-items: center;">
            <div class="info-label" style="margin-bottom: 0; margin-left: 10px; min-width: 100px;">الفترة:</div>
            <div class="info-value" style="padding: 5px 0; font-weight: 500;">${record.period || '-'}</div>
          </div>
        </div>
        <div class="info-group" style="flex: 1 0 30%; min-width: 150px; padding: 0 10px; margin-bottom: 10px;">
          <div style="display: flex; align-items: center;">
            <div class="info-label" style="margin-bottom: 0; margin-left: 10px; min-width: 100px;">المكان:</div>
            <div class="info-value" style="padding: 5px 0; font-weight: 500;">${record.location || '-'}</div>
          </div>
        </div>
        <div class="info-group" style="flex: 1 0 30%; min-width: 150px; padding: 0 10px; margin-bottom: 10px;">
          <div style="display: flex; align-items: center;">
            <div class="info-label" style="margin-bottom: 0; margin-left: 10px; min-width: 100px;">اسم السائق:</div>
            <div class="info-value" style="padding: 5px 0; font-weight: 500;">${record.driverName || '-'}</div>
          </div>
        </div>
        <div class="info-group" style="flex: 1 0 30%; min-width: 150px; padding: 0 10px; margin-bottom: 10px;">
          <div style="display: flex; align-items: center;">
            <div class="info-label" style="margin-bottom: 0; margin-left: 10px; min-width: 100px;">النقطة:</div>
            <div class="info-value" style="padding: 5px 0; font-weight: 500;">${record.point || '-'}</div>
          </div>
        </div>
        <div class="info-group" style="flex: 1 0 30%; min-width: 150px; padding: 0 10px; margin-bottom: 10px;">
          <div style="display: flex; align-items: center;">
            <div class="info-label" style="margin-bottom: 0; margin-left: 10px; min-width: 100px;">تمت الإحالة إلى:</div>
            <div class="info-value" style="padding: 5px 0; font-weight: 500;">${record.sentTo || '-'}</div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add persons information - more horizontal layout
  if (record.persons && record.persons.length > 0) {
    cardContent += `
      <div class="record-card-section" style="background-color: #f8f9fa; border-radius: 8px; padding: 15px; margin-top: 20px;">
        <div class="section-header" style="color: #2c3e50; font-size: 20px; margin-bottom: 15px;">بيانات الأشخاص (${record.persons.length})</div>
        <div class="section-body" style="display: flex; flex-wrap: wrap; gap: 15px; justify-content: space-between;">
    `;
    
    record.persons.forEach((person, index) => {
      cardContent += `
        <div class="person-info" style="display: flex; flex-direction: row; justify-content: space-between; width: 100%; background-color: white; border-radius: 8px; padding: 15px; margin-bottom: 15px; border: 1px solid #e0e0e0;">
          <h5 style="width: 100%; margin-bottom: 15px; color: #2c3e50; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px;">الشخص ${index + 1}: ${person.type || '-'}</h5>
      `;
      
      // Add photo and person details in a horizontal flex layout
      cardContent += `<div class="person-photo" style="flex: 0 0 120px; margin-left: 20px;">`;
      
      // Add photo if available
      if (person.photoData) {
        cardContent += `
          <div class="person-photo-container" style="border-radius: 15px; overflow: hidden; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);">
            <img src="${person.photoData}" alt="صورة الشخص" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
          </div>
        `;
      } else {
        cardContent += `
          <div class="person-photo-container" style="border-radius: 15px; overflow: hidden; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15); display: flex; justify-content: center; align-items: center;">
            <span style="font-size: 24px; color: #ccc;"><i class="fas fa-user"></i></span>
          </div>
        `;
      }
      
      cardContent += `</div>`;
      
      // Person details in horizontal layout
      cardContent += `<div class="person-details" style="flex: 1; display: flex; flex-wrap: wrap; justify-content: space-between;">`;

      
      cardContent += `
        <div class="info-group" style="flex: 1 0 30%; min-width: 150px; padding: 0 10px; margin-bottom: 10px;">
          <div style="display: flex; align-items: center;">
            <div class="info-label" style="margin-bottom: 0; margin-left: 10px; min-width: 100px;">الاسم الكامل:</div>
            <div class="info-value" style="padding: 5px 0; font-weight: 500;">${person.fullName || '-'}</div>
          </div>
        </div>
        <div class="info-group" style="flex: 1 0 30%; min-width: 150px; padding: 0 10px; margin-bottom: 10px;">
          <div style="display: flex; align-items: center;">
            <div class="info-label" style="margin-bottom: 0; margin-left: 10px; min-width: 100px;">سنة الميلاد:</div>
            <div class="info-value" style="padding: 5px 0; font-weight: 500;">${person.birthYear || '-'}</div>
          </div>
        </div>
        <div class="info-group" style="flex: 1 0 30%; min-width: 150px; padding: 0 10px; margin-bottom: 10px;">
          <div style="display: flex; align-items: center;">
            <div class="info-label" style="margin-bottom: 0; margin-left: 10px; min-width: 100px;">العنوان:</div>
            <div class="info-value" style="padding: 5px 0; font-weight: 500;">${person.address || '-'}</div>
          </div>
        </div>
        <div class="info-group" style="flex: 1 0 30%; min-width: 150px; padding: 0 10px; margin-bottom: 10px;">
          <div style="display: flex; align-items: center;">
            <div class="info-label" style="margin-bottom: 0; margin-left: 10px; min-width: 100px;">الهاتف:</div>
            <div class="info-value" style="padding: 5px 0; font-weight: 500;">${person.phone || '-'}</div>
          </div>
        </div>
      `;
      
      // Add tomatbar specific fields if they exist
      if (person.maritalStatus || person.occupation || person.imprisonment || person.idNumber) {
        cardContent += `
          <div class="info-group" style="flex: 1 0 30%; min-width: 150px; padding: 0 10px; margin-bottom: 10px;">
            <div style="display: flex; align-items: center;">
              <div class="info-label" style="margin-bottom: 0; margin-left: 10px; min-width: 100px;">الحالة الاجتماعية:</div>
              <div class="info-value" style="padding: 5px 0; font-weight: 500;">${person.maritalStatus || '-'}</div>
            </div>
          </div>
          <div class="info-group" style="flex: 1 0 30%; min-width: 150px; padding: 0 10px; margin-bottom: 10px;">
            <div style="display: flex; align-items: center;">
              <div class="info-label" style="margin-bottom: 0; margin-left: 10px; min-width: 100px;">المهنة:</div>
              <div class="info-value" style="padding: 5px 0; font-weight: 500;">${person.occupation || '-'}</div>
            </div>
          </div>
          <div class="info-group" style="flex: 1 0 30%; min-width: 150px; padding: 0 10px; margin-bottom: 10px;">
            <div style="display: flex; align-items: center;">
              <div class="info-label" style="margin-bottom: 0; margin-left: 10px; min-width: 100px;">محكوم بالسجن:</div>
              <div class="info-value" style="padding: 5px 0; font-weight: 500;">${person.imprisonment || '-'}</div>
            </div>
          </div>
          <div class="info-group" style="flex: 1 0 30%; min-width: 150px; padding: 0 10px; margin-bottom: 10px;">
            <div style="display: flex; align-items: center;">
              <div class="info-label" style="margin-bottom: 0; margin-left: 10px; min-width: 100px;">رقم الهوية:</div>
              <div class="info-value" style="padding: 5px 0; font-weight: 500;">${person.idNumber || '-'}</div>
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
  
  // Add notes if available - horizontal layout
  if (record.notes) {
    cardContent += `
      <div class="record-card-section" style="background-color: #f8f9fa; border-radius: 8px; padding: 15px; margin-top: 20px;">
        <div class="section-header" style="color: #2c3e50; font-size: 20px; margin-bottom: 15px;">ملاحظات</div>
        <div class="section-body" style="display: flex; flex-wrap: wrap; justify-content: space-between;">
          <div class="info-group" style="flex-basis: 100%;">
            <div class="info-value" style="padding: 10px; background-color: white; border-radius: 8px; border: 1px solid #e0e0e0;">${record.notes}</div>
          </div>
        </div>
      </div>
    `;
  }
  
  // Add footer with timestamp
  cardContent += `
    </div>
    <div class="record-card-footer" style="background-color: #f8f9fa; border-top: 1px solid #e0e0e0; padding: 15px; text-align: center; color: #666; font-size: 14px; margin-top: 20px; border-radius: 0 0 10px 10px;">
      تم إنشاء هذه البطاقة بتاريخ: ${formatDate(record.timestamp)}
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