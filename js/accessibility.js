// Toggle panel open/close
document.getElementById('a11y-toggle').onclick = function(){
  var panel = document.getElementById('a11y-panel');
  panel.style.display = (panel.style.display === 'none' || !panel.style.display) ? 'block' : 'none';
};
// Greek accessibility functions
let currentFontSize = 100;
window.resizeFont = function(step) {
  currentFontSize += step * 10;
  document.body.style.fontSize = currentFontSize + '%';
}
window.toggleGray = function() {
  document.body.classList.toggle('gray-mode');
}
window.toggleContrast = function() {
  document.body.classList.toggle('high-contrast');
}
window.toggleInvert = function() {
  document.body.classList.toggle('invert-mode');
}
window.clearContent = function() {
  document.querySelectorAll('aside, .sidebar, .ads, .extra-content').forEach(e => e.style.display = 'none');
}
window.toggleUnderlineLinks = function() {
  document.body.classList.toggle('underline-links');
}
window.toggleLegible = function() {
  document.body.classList.toggle('legible-mode');
}
window.resetAccessibility = function() {
  document.body.classList.remove('gray-mode', 'high-contrast', 'invert-mode', 'underline-links', 'legible-mode');
  document.body.style.fontSize = '';
}
