function calculateLoanRepayment(
  govLoanAmount,
  govRate,
  govYears,
  commLoanAmount,
  commRate,
  commYears,
) {
  // 转换年利率为月利率
  const govMonthlyRate = govRate / 12 / 100;
  const commMonthlyRate = commRate / 12 / 100;

  // 计算总期数
  const govTotalMonths = govYears * 12;
  const commTotalMonths = commYears * 12;

  // 等额本息计算
  function equalInstallment(amount, monthlyRate, months) {
    if (amount === 0)
      return {
        installment: 0,
        totalRepayment: 0,
        totalInterest: 0,
        paymentSchedule: [],
      };

    // 计算每期还款额
    const installment =
      (amount * (monthlyRate * Math.pow(1 + monthlyRate, months))) /
      (Math.pow(1 + monthlyRate, months) - 1);
    // 计算总还款额
    const totalRepayment = installment * months;
    // 计算总利息
    const totalInterest = totalRepayment - amount;
    // 创建每期还款计划
    const paymentSchedule = [];
    let remainingBalance = amount; // 剩余本金
    for (let month = 1; month <= months; month++) {
      // 计算每期利息
      const interest = remainingBalance * monthlyRate;
      // 计算每期本金
      const principal = installment - interest;
      // 更新剩余本金
      remainingBalance -= principal;
      // 添加到还款计划中
      paymentSchedule.push({
        month: month,
        payment: installment.toFixed(2),
        interest: interest.toFixed(2),
        principal: principal.toFixed(2),
      });
    }
    return {installment, totalRepayment, totalInterest, paymentSchedule};
  }

  // 等额本金计算
  function equalPrincipal(amount, monthlyRate, months) {
    if (amount === 0)
      return {
        monthlyPrincipal: 0,
        totalRepayment: 0,
        totalInterest: 0,
        paymentSchedule: [],
      };

    // 计算每期本金
    const monthlyPrincipal = amount / months;
    // 计算总还款额
    let totalRepayment = 0;
    // 计算总利息
    let totalInterest = 0;
    // 创建每期还款计划
    const paymentSchedule = [];
    let remainingBalance = amount; // 剩余本金
    for (let month = 1; month <= months; month++) {
      // 计算每期利息
      const interest = remainingBalance * monthlyRate;
      // 计算每期还款额
      const payment = monthlyPrincipal + interest;
      // 更新总还款额
      totalRepayment += payment;
      // 更新总利息
      totalInterest += interest;
      // 更新剩余本金
      remainingBalance -= monthlyPrincipal;
      // 添加到还款计划中
      paymentSchedule.push({
        month: month,
        payment: payment.toFixed(2),
        principal: monthlyPrincipal.toFixed(2),
        interest: interest.toFixed(2),
      });
    }
    return {monthlyPrincipal, totalRepayment, totalInterest, paymentSchedule};
  }

  // 将入参金额从万元转换为元
  const govLoanAmountYuan = govLoanAmount * 10000;
  const commLoanAmountYuan = commLoanAmount * 10000;

  // 计算公积金贷款和商业贷款的结果
  const govEIP = equalInstallment(
    govLoanAmountYuan,
    govMonthlyRate,
    govTotalMonths,
  );
  const commEIP = equalInstallment(
    commLoanAmountYuan,
    commMonthlyRate,
    commTotalMonths,
  );
  const govEPP = equalPrincipal(
    govLoanAmountYuan,
    govMonthlyRate,
    govTotalMonths,
  );
  const commEPP = equalPrincipal(
    commLoanAmountYuan,
    commMonthlyRate,
    commTotalMonths,
  );

  // 合并等额本息的每期还款情况
  const totalEIP = {
    totalRepayment: govEIP.totalRepayment + commEIP.totalRepayment,
    totalInterest: govEIP.totalInterest + commEIP.totalInterest,
    installment: govEIP.installment + commEIP.installment,
    paymentSchedule: [],
  };

  for (
    let i = 0;
    i < Math.max(govEIP.paymentSchedule.length, commEIP.paymentSchedule.length);
    i++
  ) {
    const govItem = govEIP.paymentSchedule[i];
    const commItem = commEIP.paymentSchedule[i];
    if (govItem && commItem) {
      totalEIP.paymentSchedule.push({
        month: govItem.month,
        payment: (
          parseFloat(govItem.payment) + parseFloat(commItem.payment)
        ).toFixed(2),
        interest: (
          parseFloat(govItem.interest) + parseFloat(commItem.interest)
        ).toFixed(2),
        principal: (
          parseFloat(govItem.principal) + parseFloat(commItem.principal)
        ).toFixed(2),
      });
    } else if (govItem) {
      totalEIP.paymentSchedule.push({
        month: govItem.month,
        payment: govItem.payment,
        interest: govItem.interest,
        principal: govItem.principal,
      });
    } else if (commItem) {
      totalEIP.paymentSchedule.push({
        month: commItem.month,
        payment: commItem.payment,
        interest: commItem.interest,
        principal: commItem.principal,
      });
    }
  }

  // 合并等额本金的每期还款情况
  const totalEPP = {
    totalRepayment: govEPP.totalRepayment + commEPP.totalRepayment,
    totalInterest: govEPP.totalInterest + commEPP.totalInterest,
    monthlyPrincipal: govEPP.monthlyPrincipal + commEPP.monthlyPrincipal,
    paymentSchedule: [],
  };

  for (
    let i = 0;
    i < Math.max(govEPP.paymentSchedule.length, commEPP.paymentSchedule.length);
    i++
  ) {
    const govItem = govEPP.paymentSchedule[i];
    const commItem = commEPP.paymentSchedule[i];
    if (govItem && commItem) {
      totalEPP.paymentSchedule.push({
        month: govItem.month,
        payment: (
          parseFloat(govItem.payment) + parseFloat(commItem.payment)
        ).toFixed(2),
        principal: (
          parseFloat(govItem.principal) + parseFloat(commItem.principal)
        ).toFixed(2),
        interest: (
          parseFloat(govItem.interest) + parseFloat(commItem.interest)
        ).toFixed(2),
      });
    } else if (govItem) {
      totalEPP.paymentSchedule.push({
        month: govItem.month,
        payment: govItem.payment,
        principal: govItem.principal,
        interest: govItem.interest,
      });
    } else if (commItem) {
      totalEPP.paymentSchedule.push({
        month: commItem.month,
        payment: commItem.payment,
        principal: commItem.principal,
        interest: commItem.interest,
      });
    }
  }

  // 返回结果
  return {
    equalInstallment: totalEIP,
    equalPrincipal: totalEPP,
  };
}

export {calculateLoanRepayment};
