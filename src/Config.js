const baseUrl = "http://localhost:8000"
const formatNumber = (num) => {
    return parseFloat(num).toFixed(0).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}

export {baseUrl, formatNumber}