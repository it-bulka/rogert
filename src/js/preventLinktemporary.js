export const preventLinktemporary = () => {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if(link) {
      link.preventDefault();
    }
  })
}