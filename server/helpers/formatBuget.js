const formatBudget = (budget) => {
  return Number(String(budget).replace(/\D/g, ""));
};

module.exports = formatBudget;