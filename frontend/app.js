// JavaScript for user form app

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('userForm');
    const submitBtn = form.querySelector('.submit-btn');
    const loadingSpinner = form.querySelector('.loading-spinner');
    const btnText = form.querySelector('.btn-text');
    const messageDiv = document.getElementById('message');

    // Replace this URL with your actual API endpoint
    const API_URL = 'http://localhost:8000/predict';

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        // Show loading state
        submitBtn.disabled = true;
        loadingSpinner.style.display = 'inline-block';
        btnText.textContent = 'Submitting...';
        hideMessage();
        try {
            // Collect form data
            const formData = new FormData(form);
            const userData = {
                age: parseInt(formData.get('age')),
                weight: parseFloat(formData.get('weight')),
                height: parseFloat(formData.get('height')) / 100, // convert cm to meters
                income_lpa: parseFloat(formData.get('income_lpa')),
                smoker: formData.get('smoke') === 'yes',
                city: formData.get('city').trim(),
                occupation: formData.get('occupation')
            };
            // Make API call
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });
            if (response.ok) {
                const result = await response.json();
                // Show the prediction result from API
                if (result.insurance_premium_category) {
                    showMessage(`Prediction: ${result.insurance_premium_category}`, 'success');
                } else {
                    showMessage('Data submitted successfully!', 'success');
                }
                form.reset();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Submission failed');
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage(error.message || 'An error occurred. Please try again.', 'error');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            loadingSpinner.style.display = 'none';
            btnText.textContent = 'Submit Information';
        }
    });

    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                hideMessage();
            }, 5000);
        }
    }

    function hideMessage() {
        messageDiv.style.display = 'none';
    }

    // Add input validation feedback
    const inputs = form.querySelectorAll('input[required], select[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearValidation);
    });

    function validateField(e) {
        const field = e.target;
        if (!field.checkValidity()) {
            field.style.borderColor = '#dc3545';
        }
    }

    function clearValidation(e) {
        const field = e.target;
        if (field.style.borderColor === 'rgb(220, 53, 69)') {
            field.style.borderColor = '#e1e5e9';
        }
    }
});
