document.addEventListener('DOMContentLoaded', function () {
    const sidebarLinks = document.querySelectorAll('.nav-link');
    const offcanvasSidebar = document.querySelector('.offcanvas-body .sidebar2');
    const sidebar = document.querySelector('.sidebar');

    const modal = document.getElementById('add-modal');
    const submitStudentButton = document.getElementById('add-student-btn');
    const modalCancelBtn = document.getElementById('add-student-cancel');
    const closeModalBtn = document.getElementById('close-add-modal-btn');

    const deleteModal = document.getElementById('delete-warning-modal');
    const deleteStudentBtn = document.getElementById('delete-student-btn');

    const tableBody = document.getElementById('table-body');
    
    const studentForm = document.getElementById('add-student-form');
    
    let editButton;
    let deleteButton;


    sidebarLinks.forEach((navLink) => {
        navLink.addEventListener('click', function () {
            const closeSidebarBtn = document.querySelector('#close-sidebar-btn');
            sidebarLinks.forEach(link => link.classList.remove('active'));
            if (closeSidebarBtn) {
                closeSidebarBtn.click();
            }
            navLink.classList.add('active');

        });
    });

    function addStudent(student) {
        const row = `
                <tr>
                    <th scope="row"><input type="checkbox"></th>
                    <td>${student.group}</td>
                    <td>${student.name}</td>
                    <td>${student.gender}</td>
                    <td>${student.birthday}</td>
                    <td><i class="bi bi-circle-fill ${student.status != '' ? 'active' : ''}"></i></td>
                    <td>
                        <button type="button" class="btn btn-warning edit-btn" data-student-id=${student.id} data-bs-toggle="modal" data-bs-target="#add-modal">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button type="button" class="btn btn-danger delete-btn" data-student-id="${student.id}" data-bs-toggle="modal" data-bs-target="#delete-warning-modal">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        tableBody.insertAdjacentHTML('beforeend', row);
    }
    function editStudent(student) {
        const row = editButton.closest('tr');
        row.innerHTML = '';
        row.innerHTML = `
            <tr>
                <th scope="row"><input type="checkbox"></th>
                <td>${student.group}</td>
                <td>${student.name}</td>
                <td>${student.gender}</td>
                <td>${student.birthday}</td>
                <td><i class="bi bi-circle-fill ${student.id % 2 == 0 ? 'active' : ''}"></i></td>
                <td>
                    <button type="button" class="btn btn-warning edit-btn" data-student-id=${student.id} data-bs-toggle="modal" data-bs-target="#add-modal">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button type="button" class="btn btn-danger delete-btn" data-student-id="${student.id}" data-bs-toggle="modal" data-bs-target="#delete-warning-modal">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }
    function deleteStudent() {
        const row = deleteButton.closest('tr');
        if (row) {
            row.remove(); 
        }
    }

    // ============ SUBMIT POST/DELETE ============
    submitStudentButton.addEventListener('click', function (event) {
        if (!studentForm.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }
        studentForm.classList.add('was-validated');
        if (studentForm.checkValidity()) {
            const id = tableBody.lastElementChild ? parseInt(tableBody.lastElementChild.querySelector('.edit-btn').getAttribute('data-student-id')) + 1 : 1;
            const group = document.getElementById('add-group-select').value;
            const firstName = document.getElementById('add-first-name-input').value;
            const lastName = document.getElementById('add-last-name-input').value;
            const gender = document.getElementById('add-gender-select').value;
            const birthday = document.getElementById('add-date-input').value;
            const status = document.getElementById('activeRadioBtn').checked ? 'active' : '';

            const student = {
                group: group,
                name: `${firstName} ${lastName}`,
                gender: gender,
                birthday: birthday,
                status: status
            };            
            if (submitStudentButton.textContent == 'Edit') {
                student.id = document.getElementById('add-id-input').value;
                editStudent(student);
                closeModalBtn.click();
            }
            fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(student)
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                console.log('Response from server:', data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
            if (submitStudentButton.textContent == 'Add') {
                student.id = id;
                addStudent(student);
                closeModalBtn.click();
            }
            studentForm.reset(); 
            studentForm.classList.remove('was-validated');
        }
    });
    deleteStudentBtn.addEventListener('click', () => {
        const closeModal = document.getElementById('close-delete-warning-modal-btn');
        deleteStudent();
        closeModal.click();

        fetch('/', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({id: deleteButton.getAttribute('data-student-id')})
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                console.log('Response from server:', data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
    // ============================================

    // ============== FOR VALIDATION ==============
    modalCancelBtn.addEventListener('click', function () { 
        studentForm.reset(); 
        studentForm.classList.remove('was-validated');
    });
    closeModalBtn.addEventListener('click', function () { 
        studentForm.reset(); 
        studentForm.classList.remove('was-validated');
    });
    // ============================================
    
    offcanvasSidebar.innerHTML = sidebar.innerHTML;

    modal.addEventListener('show.bs.modal', function (event) {
        const triggerBtn = event.relatedTarget;
        const id = triggerBtn.getAttribute('data-student-id');
        if (id != '') {
            editButton = triggerBtn;
            const row = triggerBtn.closest('tr');

            const [firstName, lastName] = row.querySelector('td:nth-child(3)').textContent.split(' '); 
            const group = row.querySelector('td:nth-child(2)').textContent;
            const gender = row.querySelector('td:nth-child(4)').textContent;
            const birthday = row.querySelector('td:nth-child(5)').textContent;
            const status = row.querySelector('td:nth-child(6)').querySelector('i').classList.contains('active') ? 'active' : '';

            modal.querySelector('h1').textContent = 'Edit Student';
            modal.querySelector('.btn-primary').textContent = 'Edit';
            modal.querySelector('#add-id-input').value = id;
            modal.querySelector('#add-group-select').value = group;
            modal.querySelector('#add-first-name-input').value = firstName;
            modal.querySelector('#add-last-name-input').value = lastName;
            modal.querySelector('#add-gender-select').value = gender;
            modal.querySelector('#add-date-input').value = birthday;
            modal.querySelector('#activeRadioBtn').checked = status != '' ? true : false;
        }
        else {
            modal.querySelector('h1').textContent = 'Add Student';
            modal.querySelector('.btn-primary').textContent = 'Add';
            studentForm.reset(); 
            studentForm.classList.remove('was-validated');
        }
    });
    deleteModal.addEventListener('show.bs.modal', function (event) {
        deleteButton = event.relatedTarget;
        const row = deleteButton.closest('tr');
        const deleteWarningMessage = document.getElementById('delete-warning-message');
        deleteWarningMessage.innerHTML = '';
        deleteWarningMessage.innerHTML = `Are you sure you want to delete student ${row.querySelector('td:nth-child(3)').textContent}?`;
    });

});