document.addEventListener('DOMContentLoaded', function() {
  const calendarEl = document.getElementById('calendar');

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth', 
    firstDay: 1, 
    events: 'http://localhost:3000/api/reservations', 
    
    eventContent: function(arg) {
      const title = arg.event.title; 
      const purpose = arg.event.extendedProps.purpose; 
      const attendees = arg.event.extendedProps.attendees; 

      return {
        html: `
          <div style="font-size: 12px;">
            <strong>${title}</strong><br>
            <small>Purpose: ${purpose}</small><br>
            <small>Attendees: ${attendees}</small>
          </div>
        `
      };
    },

    eventClick: function(info) {
      const title = info.event.title; 
      const purpose = info.event.extendedProps.purpose; 
      const attendees = info.event.extendedProps.attendees; 

      alert(`
        Title: ${title}\n
        Purpose: ${purpose}\n
        Attendees: ${attendees}
      `);
    }
  });

  // Рендерим календарь
  calendar.render();
});

function submitBookingForm(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = {
    room_id: parseInt(formData.get('room')),
    date: formData.get('date'), 
    start_time: formData.get('startTime'), 
    end_time: formData.get('endTime'), 
    purpose: formData.get('purpose'), 
    attendees: parseInt(formData.get('attendees')) 
  };

  fetch('http://localhost:3000/api/reservations', {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify(data) 
  })
  .then(response => {
    if (!response.ok) { 
      return response.json().then(err => {
        throw new Error(err.message || 'Server error'); 
      });
    }
    return response.json();
  })
  .then(data => {
    alert('Reservation added successfully!');
    window.location.reload(); 
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Error adding reservation: ' + error.message); 
  });
}
