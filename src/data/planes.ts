/*
 * Planes de Jzet Labs (aprobados el 6 de noviembre de 2026).
 * Se cuentan por usuarios: cada persona que entra al sistema (empleado que marca,
 * cajero, recepcionista, maestro). Clientes, pacientes y alumnos no cuentan.
 * Si cambia un precio aquí, cámbielo también en La tienda:
 * ~/Downloads/catalogo/portafolio/index.html (sección id="planes").
 */
export type Plan = {
  nombre: string;
  para: string;
  monto: string;
  periodo: string;
  nota: string;
  incluye: string[];
  noIncluye?: string;
  destacado?: boolean;
};

export const PLANES: Plan[] = [
  {
    nombre: "Propio",
    para: "Para negocios que prefieren pagar una vez y no pagar cada mes.",
    monto: "Q3,000",
    periodo: "pago único",
    nota: "50% al iniciar y 50% al entregar. Después, Q600 al año de servidor. El precio final depende de lo que se pacte por escrito.",
    incluye: ["Hasta 25 usuarios", "Un módulo principal: ventas, citas, cobros, inventario o planilla", "Capacitación y 1 año de servidor", "Correcciones durante el primer mes"],
    noIncluye: "Módulos extra, cambios fuera de lo pactado ni correcciones después del primer mes. Esos se cotizan aparte.",
  },
  {
    nombre: "Control",
    para: "Para negocios que quieren lo esencial, siempre al día.",
    monto: "Q495",
    periodo: "al mes",
    nota: "Más Q1,000 de instalación, una sola vez.",
    incluye: ["Hasta 15 usuarios", "El módulo principal de su rubro: ventas, citas, cobros, inventario o planilla", "Respaldos diarios", "Soporte por WhatsApp de lunes a viernes"],
  },
  {
    nombre: "Integral",
    para: "Para negocios que lo quieren todo, con soporte cercano.",
    monto: "Q1,450",
    periodo: "al mes",
    nota: "Más Q1,500 de instalación, una sola vez.",
    incluye: ["Usuarios sin límite", "Todos los módulos que su negocio necesite", "Reportes en Excel y PDF", "Soporte prioritario, también sábados"],
    destacado: true,
  },
];

export const NOTA_USUARIOS =
  "Usuario es cada persona de su equipo que entra al sistema. Sus clientes, pacientes o alumnos no cuentan.";

export const REGLAS =
  "Lo que se pacta por escrito es lo que se entrega. Si después quiere agregar algo que no estaba en el contrato, aunque sea al día siguiente, le mando la cotización y usted decide. Aplica igual al pago único y a los planes mensuales.";

export const FRASES = [
  "Un sistema a su medida. Un plan a su alcance.",
  "Hay un plan para cada empresa.",
  "Si un plan no le queda, armamos otro.",
];
