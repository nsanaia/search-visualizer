export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function generateRandomNumbers(...nums) {
    return nums.map(n => Math.floor(Math.random() * (n)));
}

export function getEventTargetData(e) {
    return e.target.dataset || {};
}
