import messages_pack from './constants/messages';

// Loaded once
var currentLanguage = localStorage.getItem('lang') || 'en'; // load from local_storage => if not found default en
console.log('[LANGAUGE]: Current => ' + currentLanguage);
function extract_language(library) {
	return messages_pack[currentLanguage][library];
}
export default extract_language;
