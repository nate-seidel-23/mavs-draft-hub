export const formatHeight = (inches) => {
    if (!inches || isNaN(inches)) return '-';
    const feet = Math.floor(inches / 12);
    const remainingInches = inches % 12;
    return `${feet}' ${remainingInches}"`;
};