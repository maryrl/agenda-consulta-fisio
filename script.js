 // Global variables
        let appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        let blockedTimes = JSON.parse(localStorage.getItem('blockedTimes') || '[]');
        let isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
        
        // Admin credentials (in production, this should be handled server-side)
        const adminCredentials = {
            email: 'dra.ana@fisioterapia.com',
            password: 'admin123'
        };
        
        // Available time slots
        const timeSlots = [
            '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
            '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
        ];

        // Initialize the application
        document.addEventListener('DOMContentLoaded', function() {
            setupDateInput();
            updateTimeSlots();
            updateAdminStats();
            updateAppointmentsTable();
        });

        // Setup minimum date for appointment booking
        function setupDateInput() {
            const dateInput = document.getElementById('appointment-date');
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            dateInput.min = tomorrow.toISOString().split('T')[0];
            dateInput.addEventListener('change', updateTimeSlots);
        }

        // Update available time slots based on selected date
        function updateTimeSlots() {
            const dateInput = document.getElementById('appointment-date');
            const timeSelect = document.getElementById('appointment-time');
            const selectedDate = dateInput.value;
            
            timeSelect.innerHTML = '<option value="">Selecione um horário</option>';
            
            if (!selectedDate) return;
            
            const dayOfWeek = new Date(selectedDate).getDay();
            let availableSlots = [...timeSlots];
            
            // Remove Sunday slots
            if (dayOfWeek === 0) {
                timeSelect.innerHTML = '<option value="">Domingo - Fechado</option>';
                return;
            }
            
            // Saturday only morning slots
            if (dayOfWeek === 6) {
                availableSlots = timeSlots.filter(time => time < '12:00');
            }
            
            // Remove booked appointments
            const bookedTimes = appointments
                .filter(apt => apt.date === selectedDate)
                .map(apt => apt.time);
            
            // Remove blocked times
            const blockedTimesForDate = blockedTimes
                .filter(block => block.date === selectedDate)
                .flatMap(block => getTimeRange(block.startTime, block.endTime));
            
            availableSlots = availableSlots.filter(time => 
                !bookedTimes.includes(time) && !blockedTimesForDate.includes(time)
            );
            
            availableSlots.forEach(time => {
                const option = document.createElement('option');
                option.value = time;
                option.textContent = time;
                timeSelect.appendChild(option);
            });
            
            if (availableSlots.length === 0) {
                timeSelect.innerHTML = '<option value="">Nenhum horário disponível</option>';
            }
        }

        // Get time range for blocking
        function getTimeRange(start, end) {
            const times = [];
            const startTime = timeSlots.indexOf(start);
            const endTime = timeSlots.indexOf(end);
            
            for (let i = startTime; i <= endTime; i++) {
                if (timeSlots[i]) times.push(timeSlots[i]);
            }
            return times;
        }

        // Handle appointment booking form submission
        document.getElementById('booking-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                id: Date.now(),
                name: document.getElementById('patient-name').value,
                phone: document.getElementById('patient-phone').value,
                email: document.getElementById('patient-email').value,
                date: document.getElementById('appointment-date').value,
                time: document.getElementById('appointment-time').value,
                notes: document.getElementById('appointment-notes').value,
                status: 'Confirmado',
                createdAt: new Date().toISOString()
            };
            
            appointments.push(formData);
            localStorage.setItem('appointments', JSON.stringify(appointments));
            
            showSuccessMessage(formData);
            sendWhatsAppConfirmation(formData);
            sendEmailNotification(formData);
            
            updateAdminStats();
            updateAppointmentsTable();
        });

        // Show success message
        function showSuccessMessage(appointment) {
            document.getElementById('patient-section').style.display = 'none';
            document.getElementById('success-message').classList.remove('hidden');
            
            const details = document.getElementById('appointment-details');
            details.innerHTML = `
                <div><strong>Paciente:</strong> ${appointment.name}</div>
                <div><strong>Data:</strong> ${formatDate(appointment.date)}</div>
                <div><strong>Horário:</strong> ${appointment.time}</div>
                <div><strong>WhatsApp:</strong> ${appointment.phone}</div>
                ${appointment.notes ? `<div><strong>Observações:</strong> ${appointment.notes}</div>` : ''}
            `;
        }

        // Send WhatsApp confirmation (Demo)
        function sendWhatsAppConfirmation(appointment) {
            const message = `🏥 *Consulta Confirmada - Dra. Ana Silva*\n\n` +
                          `Olá ${appointment.name}!\n\n` +
                          `Sua consulta foi agendada com sucesso:\n` +
                          `📅 Data: ${formatDate(appointment.date)}\n` +
                          `🕐 Horário: ${appointment.time}\n\n` +
                          `📍 Endereço: Rua das Flores, 123 - Centro\n\n` +
                          `Em caso de dúvidas, entre em contato conosco.\n\n` +
                          `Atenciosamente,\nEquipe Dra. Ana Silva`;
            
            // Demo notification
            setTimeout(() => {
                alert(`📱 WhatsApp enviado para ${appointment.phone}\n\nMensagem: ${message}`);
            }, 1000);
        }

        // Send email notification (Demo)
        function sendEmailNotification(appointment) {
            const emailContent = {
                to: 'dra.ana@fisioterapia.com',
                subject: `Nova Consulta Agendada - ${appointment.name}`,
                body: `Nova consulta agendada:\n\n` +
                      `Paciente: ${appointment.name}\n` +
                      `Data: ${formatDate(appointment.date)}\n` +
                      `Horário: ${appointment.time}\n` +
                      `Telefone: ${appointment.phone}\n` +
                      `Email: ${appointment.email}\n` +
                      `Observações: ${appointment.notes || 'Nenhuma'}`
            };
            
            // Demo notification
            setTimeout(() => {
                console.log('📧 Email enviado para a fisioterapeuta:', emailContent);
            }, 1500);
        }

        // New appointment
        function newAppointment() {
            document.getElementById('success-message').classList.add('hidden');
            document.getElementById('patient-section').style.display = 'block';
            document.getElementById('booking-form').reset();
            setupDateInput();
            updateTimeSlots();
        }

        // Show login modal
        function showLoginModal() {
            if (isLoggedIn) {
                toggleAdminPanel();
            } else {
                document.getElementById('login-modal').classList.remove('hidden');
                document.getElementById('admin-email').focus();
            }
        }

        // Hide login modal
        function hideLoginModal() {
            document.getElementById('login-modal').classList.add('hidden');
            document.getElementById('login-form').reset();
            document.getElementById('login-error').classList.add('hidden');
        }

        // Toggle password visibility
        function togglePasswordVisibility() {
            const passwordInput = document.getElementById('admin-password');
            const passwordIcon = document.getElementById('password-icon');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                passwordIcon.classList.remove('fa-eye');
                passwordIcon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                passwordIcon.classList.remove('fa-eye-slash');
                passwordIcon.classList.add('fa-eye');
            }
        }

        // Handle login form submission
        document.getElementById('login-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('admin-email').value;
            const password = document.getElementById('admin-password').value;
            
            if (email === adminCredentials.email && password === adminCredentials.password) {
                isLoggedIn = true;
                sessionStorage.setItem('adminLoggedIn', 'true');
                hideLoginModal();
                toggleAdminPanel();
            } else {
                document.getElementById('login-error').classList.remove('hidden');
                document.getElementById('admin-password').value = '';
                document.getElementById('admin-password').focus();
            }
        });

        // Logout function
        function logout() {
            if (confirm('Tem certeza que deseja sair do painel administrativo?')) {
                isLoggedIn = false;
                sessionStorage.removeItem('adminLoggedIn');
                toggleAdminPanel();
            }
        }

        // Toggle admin panel
        function toggleAdminPanel() {
            if (!isLoggedIn) {
                showLoginModal();
                return;
            }
            
            const adminPanel = document.getElementById('admin-panel');
            const patientSection = document.getElementById('patient-section');
            
            if (adminPanel.style.display === 'none' || !adminPanel.style.display) {
                adminPanel.style.display = 'block';
                patientSection.style.display = 'none';
                document.getElementById('success-message').classList.add('hidden');
            } else {
                adminPanel.style.display = 'none';
                patientSection.style.display = 'block';
            }
        }

        // Show admin tabs
        function showTab(tabName) {
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.add('hidden');
            });
            
            // Remove active class from all tabs
            document.querySelectorAll('[id$="-tab"]').forEach(tab => {
                tab.classList.remove('border-purple-500', 'text-purple-600');
                tab.classList.add('border-transparent', 'text-gray-500');
            });
            
            // Show selected tab content
            document.getElementById(tabName + '-content').classList.remove('hidden');
            
            // Add active class to selected tab
            const activeTab = document.getElementById(tabName + '-tab');
            activeTab.classList.add('border-purple-500', 'text-purple-600');
            activeTab.classList.remove('border-transparent', 'text-gray-500');
        }

        // Update admin statistics
        function updateAdminStats() {
            const today = new Date().toISOString().split('T')[0];
            const thisWeekStart = getWeekStart(new Date());
            const thisMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
            
            const todayCount = appointments.filter(apt => apt.date === today).length;
            const weekCount = appointments.filter(apt => apt.date >= thisWeekStart).length;
            const monthCount = appointments.filter(apt => apt.date >= thisMonthStart).length;
            
            document.getElementById('today-appointments').textContent = todayCount;
            document.getElementById('week-appointments').textContent = weekCount;
            document.getElementById('month-appointments').textContent = monthCount;
        }

        // Get week start date
        function getWeekStart(date) {
            const d = new Date(date);
            const day = d.getDay();
            const diff = d.getDate() - day + (day === 0 ? -6 : 1);
            return new Date(d.setDate(diff)).toISOString().split('T')[0];
        }

        // Update appointments table
        function updateAppointmentsTable() {
            const tbody = document.getElementById('appointments-table');
            
            if (appointments.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                            Nenhuma consulta agendada ainda
                        </td>
                    </tr>
                `;
                return;
            }
            
            const sortedAppointments = appointments.sort((a, b) => 
                new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time)
            );
            
            tbody.innerHTML = sortedAppointments.map(apt => `
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900">${apt.name}</div>
                        <div class="text-sm text-gray-500">${apt.email}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">${formatDate(apt.date)}</div>
                        <div class="text-sm text-gray-500">${apt.time}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">${apt.phone}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            ${apt.status}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button onclick="cancelAppointment(${apt.id})" 
                                class="text-red-600 hover:text-red-900 mr-3">
                            <i class="fas fa-times"></i>
                        </button>
                        <button onclick="sendReminder(${apt.id})" 
                                class="text-blue-600 hover:text-blue-900">
                            <i class="fas fa-bell"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        }

        // Cancel appointment
        function cancelAppointment(id) {
            if (confirm('Tem certeza que deseja cancelar esta consulta?')) {
                appointments = appointments.filter(apt => apt.id !== id);
                localStorage.setItem('appointments', JSON.stringify(appointments));
                updateAppointmentsTable();
                updateAdminStats();
            }
        }

        // Send reminder
        function sendReminder(id) {
            const appointment = appointments.find(apt => apt.id === id);
            if (appointment) {
                alert(`📱 Lembrete enviado para ${appointment.name} via WhatsApp!`);
            }
        }

        // Block time form submission
        document.getElementById('block-time-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const blockData = {
                id: Date.now(),
                date: document.getElementById('block-date').value,
                startTime: document.getElementById('block-start').value,
                endTime: document.getElementById('block-end').value,
                reason: document.getElementById('block-reason').value
            };
            
            blockedTimes.push(blockData);
            localStorage.setItem('blockedTimes', JSON.stringify(blockedTimes));
            
            alert('Horário bloqueado com sucesso!');
            this.reset();
            updateTimeSlots();
        });

        // Format date for display
        function formatDate(dateString) {
            const date = new Date(dateString + 'T00:00:00');
            return date.toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }

        import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const db = getFirestore(app);

async function carregarAgendamentos() {
  const agendamentosCol = collection(db, "agendamentos");
  const agendamentosSnapshot = await getDocs(agendamentosCol);
  const agendamentosList = agendamentosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  const tbody = document.getElementById("appointments-table");
  tbody.innerHTML = ""; // limpa tabela

  if (agendamentosList.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-4 text-center text-gray-500">Nenhuma consulta agendada ainda</td></tr>`;
    return;
  }

  agendamentosList.forEach(item => {
    tbody.innerHTML += `
      <tr>
        <td class="px-6 py-4">${item.paciente}</td>
        <td class="px-6 py-4">${item.data} ${item.hora}</td>
        <td class="px-6 py-4">${item.contato}</td>
        <td class="px-6 py-4">${item.status}</td>
        <td class="px-6 py-4">
          <!-- ações como editar ou excluir -->
          <button class="text-red-600 hover:text-red-800">Excluir</button>
        </td>
      </tr>`;
  });
}

onAuthStateChanged(auth, user => {
  if (user) {
    sessionStorage.setItem('adminLoggedIn', 'true');
    hideLoginModal();
    showAdminPanel();
    carregarAgendamentos();  // chama a função para atualizar a tabela
    console.log('Usuário logado:', user.email);
  } else {
    sessionStorage.removeItem('adminLoggedIn');
    hideAdminPanel();
    console.log('Nenhum usuário logado');
  }
});
