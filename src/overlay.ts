import './styles.css';
window.openScreen.onOverlayText(text => { document.getElementById('translation')!.textContent = text; document.body.classList.add('visible'); });
