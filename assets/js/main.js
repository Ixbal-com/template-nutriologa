// Punto de entrada. Cada módulo busca sus propios elementos con data-* y no hace
// nada si no los encuentra, así que borrar una sección del HTML nunca rompe el sitio.
// initWizard va antes de initWhatsappForm: así "Siguiente" no abre WhatsApp a medio test.
import { initNavigation } from "./modules/navigation.js";
import { initOpeningHours } from "./modules/opening-hours.js";
import { initCurrentYear } from "./modules/current-year.js";
import { initWizard } from "./modules/wizard.js";
import { initWhatsappForm } from "./modules/whatsapp-form.js";

initNavigation();
initOpeningHours();
initCurrentYear();
initWizard();
initWhatsappForm();
