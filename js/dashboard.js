document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach((navLink) => {
        navLink.addEventListener('click', function () {
            const closeSidebarBtn = document.querySelector('#close-sidebar-btn');
            navLinks.forEach(link => link.classList.remove('active'));
            if (closeSidebarBtn) {
                closeSidebarBtn.click();
            }
            navLink.classList.add('active');
            navLink.classList.add('text-dark');
            navLink.classList.remove('text-secondary');
            // if (navLink.id != 'students-link') {
            //     content.style.display = 'none';
            // }
            // else {
            //     content.style.display = 'block';
            //     displayStudents();
            //     displayPagination();
            // }

        });
    });
});