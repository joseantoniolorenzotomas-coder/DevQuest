// Registro de lenguajes de DevQuest.
// Python está completo; JavaScript empieza con el Módulo 1;
// el resto llegará en próximas sesiones (comingSoon: true).

window.LANGUAGES = [
  {
    id: 'python',
    title: 'Python',
    subtitle: 'De cero a proyectos reales',
    about: 'Lenguaje claro y versátil: automatización, análisis de datos, IA y webs. Ideal para empezar.',
    icon: '🐍',
    color: '#3776AB',
    gradient: 'linear-gradient(135deg, #3776AB 0%, #FFD43B 100%)',
    get modules() { return window.CURRICULUM.modules; }
  },
  {
    id: 'html', title: 'HTML', subtitle: 'La estructura de la web',
    about: 'El esqueleto de toda página web: estructura el contenido con etiquetas. Empieza aquí.',
    icon: '🌐', color: '#E34F26',
    gradient: 'linear-gradient(135deg, #E34F26 0%, #F16529 100%)',
    get modules() { return window.HTML_CURRICULUM; }
  },
  {
    id: 'css', title: 'CSS', subtitle: 'Diseño y estilo web',
    about: 'El estilo de la web: colores, tipografías, el modelo de caja y Flexbox para dar vida al HTML.',
    icon: '🎨', color: '#2965F1',
    gradient: 'linear-gradient(135deg, #2965F1 0%, #33A9DC 100%)',
    get modules() { return window.CSS_CURRICULUM; }
  },
  {
    id: 'javascript',
    title: 'JavaScript',
    subtitle: 'El lenguaje de la web',
    about: 'Interactividad en el navegador y servidores con Node.js. Con HTML y CSS forma la base del desarrollo web.',
    icon: '🟨',
    color: '#F7DF1E',
    gradient: 'linear-gradient(135deg, #F7DF1E 0%, #E8A800 100%)',
    get modules() { return window.JS_CURRICULUM; }
  },
  {
    id: 'sql', title: 'SQL', subtitle: 'Domina las bases de datos',
    about: 'El idioma de las bases de datos: guarda, busca y conecta la información de las apps.',
    icon: '🗄️', color: '#336791',
    gradient: 'linear-gradient(135deg, #336791 0%, #00B9D6 100%)',
    get modules() { return window.SQL_CURRICULUM || []; }
  },
  {
    id: 'java', title: 'Java', subtitle: 'Robusto y multiplataforma',
    about: 'Apps empresariales, Android y sistemas grandes. Ojo: pese al nombre, no tiene nada que ver con JavaScript.',
    icon: '☕', color: '#E76F00',
    gradient: 'linear-gradient(135deg, #E76F00 0%, #5382A1 100%)',
    get modules() { return window.JAVA_CURRICULUM || []; }
  },
  {
    id: 'cpp', title: 'C++', subtitle: 'Potencia y rendimiento',
    about: 'Potencia bruta: videojuegos, sistemas operativos y apps donde cada milisegundo cuenta.',
    icon: '⚙️', color: '#659AD2',
    gradient: 'linear-gradient(135deg, #659AD2 0%, #004482 100%)',
    get modules() { return window.CPP_CURRICULUM || []; }
  },
  {
    id: 'php', title: 'PHP', subtitle: 'La web dinámica clásica',
    about: 'El clásico de la web dinámica: WordPress y millones de sitios funcionan con PHP.',
    icon: '🐘', color: '#777BB4',
    gradient: 'linear-gradient(135deg, #777BB4 0%, #4F5B93 100%)',
    get modules() { return window.PHP_CURRICULUM || []; }
  },
  {
    id: 'go', title: 'Go', subtitle: 'Simple y concurrente',
    about: 'El lenguaje de Google: simple, rápido y con concurrencia fácil para servidores y la nube.',
    icon: '🐹', color: '#00ADD8',
    gradient: 'linear-gradient(135deg, #00ADD8 0%, #007D9C 100%)',
    get modules() { return window.GO_CURRICULUM || []; }
  },
  {
    id: 'typescript', title: 'TypeScript', subtitle: 'JavaScript con tipos',
    about: 'JavaScript con los tipos puestos: los errores aparecen al escribir el código, no al ejecutarlo.',
    icon: '🟦', color: '#3178C6',
    gradient: 'linear-gradient(135deg, #3178C6 0%, #1E4E8C 100%)',
    get modules() { return window.TS_CURRICULUM || []; }
  }
];
