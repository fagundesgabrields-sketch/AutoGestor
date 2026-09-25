// Basic frontend script for alerts and confirmations
document.addEventListener('DOMContentLoaded', () => {
  const deleteForms = document.querySelectorAll('form[method="POST"][action*="_method=DELETE"]');
  deleteForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      if (!confirm('Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.')) {
        e.preventDefault();
      }
    });
  });
});
