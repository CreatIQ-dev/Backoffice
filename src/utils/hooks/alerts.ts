import Swal from 'sweetalert2'

export const showConfirmation = (title: string, text: string) =>
    Swal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, register',
        cancelButtonText: 'Cancel',
    })

export const showSuccess = (title: string, text: string, timer = 1500) =>
    Swal.fire({
        title,
        text,
        icon: 'success',
        confirmButtonColor: '#01662b',
        timer,
    })

export const showError = (title: string, text: string) =>
    Swal.fire({
        title,
        text,
        icon: 'error',
        confirmButtonColor: '#d33',
    })
