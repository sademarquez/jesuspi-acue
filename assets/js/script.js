document.addEventListener('DOMContentLoaded', function () {
    // Manejo del menú móvil
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    // Carga dinámica de contenido desde content.json
    const contentGrid = document.getElementById('content-grid');
    if (contentGrid) {
        fetch('data/content.json')
            .then(response => response.json())
            .then(data => {
                data.forEach(item => {
                    const cardHtml = `
                        <div class="content-card" data-category="${item.category}">
                            <div class="bg-white rounded-lg shadow-lg overflow-hidden h-full flex flex-col">
                                <img src="${item.image}" 
                                     onerror="this.onerror=null;this.src='https://placehold.co/600x400/E0DCD4/4A4441?text=${item.category.charAt(0).toUpperCase() + item.category.slice(1)}';" 
                                     alt="Imagen representativa de un ${item.category}" class="w-full h-48 object-cover">
                                <div class="p-6 flex-grow">
                                    <span class="text-xs font-semibold uppercase text-[#D4AF37]">${item.category.charAt(0).toUpperCase() + item.category.slice(1)}</span>
                                    <h3 class="text-xl font-bold mt-2 mb-3 text-[#4A4441]">${item.title}</h3>
                                    <p class="text-[#8C7851] text-sm">${item.description}</p>
                                </div>
                                <div class="p-6 bg-[#FBF8F0] border-t border-[#E0DCD4]">
                                    <a href="${item.link}" class="font-semibold text-[#D4AF37] hover:underline">${item.category === 'escrito' ? 'Leer más →' : (item.category === 'charla' ? 'Ver / Escuchar →' : 'Unirse al debate →')}</a>
                                </div>
                            </div>
                        </div>
                    `;
                    contentGrid.insertAdjacentHTML('beforeend', cardHtml);
                });
                // Una vez que las tarjetas se han cargado, inicializa la lógica de filtrado
                setupFilterButtons();
            })
            .catch(error => console.error('Error al cargar el contenido:', error));
    }

    // Lógica de filtrado de contenido
    function setupFilterButtons() {
        const filterButtonsContainer = document.getElementById('filter-buttons');
        const contentCards = document.querySelectorAll('.content-card');

        if (filterButtonsContainer) {
            filterButtonsContainer.addEventListener('click', (e) => {
                if (e.target.tagName !== 'BUTTON') return;

                const filter = e.target.dataset.filter;
                
                // Actualizar clases de los botones de filtro
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.remove('active', 'bg-[#D4AF37]', 'text-white');
                    btn.classList.add('bg-[#E0DCD4]', 'text-[#4A4441]');
                });
                e.target.classList.add('active', 'bg-[#D4AF37]', 'text-white');
                e.target.classList.remove('bg-[#E0DCD4]', 'text-[#4A4441]');
                
                // Mostrar/ocultar tarjetas con animación
                contentCards.forEach(card => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.classList.remove('hidden-card');
                        card.classList.add('fade-in'); // Aplicar animación de entrada
                    } else {
                        card.classList.add('hidden-card');
                        card.classList.remove('fade-in');
                    }
                });
            });
        }
    }

    // Actualizar año en el footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Efecto de sombra en el header al hacer scroll
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('shadow-lg');
        } else {
            header.classList.remove('shadow-lg');
        }
    });

    // Observador para animaciones de sección y navegación activa
    const sections = document.querySelectorAll('main section');
    const navLinks = document.querySelectorAll('.nav-link');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 // La sección es visible al 50%
    };
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Añadir clase 'visible' para animación de entrada de sección
                entry.target.classList.add('visible');

                // Actualizar enlace de navegación activo
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').substring(1) === entry.target.id) {
                        link.classList.add('active');
                    }
                });
            } else {
                // Opcional: remover clase 'visible' si la sección sale de vista
                entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
});
