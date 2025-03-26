import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Education() {
  const topics = [
    {
      id: "investing",
      title: "Investing Basics",
      icon: "savings",
      color: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      id: "retirement",
      title: "Retirement Planning",
      icon: "account_balance",
      color: "text-green-600",
      iconBg: "bg-green-100",
    },
    {
      id: "credit",
      title: "Credit & Debt Management",
      icon: "credit_card",
      color: "text-orange-600",
      iconBg: "bg-orange-100",
    },
    {
      id: "taxes",
      title: "Tax Strategies",
      icon: "request_quote",
      color: "text-purple-600",
      iconBg: "bg-purple-100",
    },
    {
      id: "insurance",
      title: "Insurance Basics",
      icon: "health_and_safety",
      color: "text-red-600",
      iconBg: "bg-red-100",
    },
    {
      id: "homebuying",
      title: "Home Buying Guide",
      icon: "home",
      color: "text-indigo-600",
      iconBg: "bg-indigo-100",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 mb-2">Financial Education</h1>
        <p className="text-neutral-600">Expand your financial knowledge with our educational resources</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {topics.map((topic) => (
          <Card 
            key={topic.id} 
            className="transition-all hover:shadow-md"
          >
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-lg ${topic.iconBg} flex items-center justify-center mr-4`}>
                  <span className={`material-icons ${topic.color}`}>{topic.icon}</span>
                </div>
                <h3 className="text-lg font-semibold">{topic.title}</h3>
              </div>
              <a 
                href={`#${topic.id}`} 
                className={`${topic.color} hover:underline font-medium flex items-center`}
              >
                Explore topic
                <span className="material-icons text-sm ml-1">arrow_forward</span>
              </a>
            </CardContent>
          </Card>
        ))}
      </div>

      <div id="investing" className="mb-16 scroll-mt-16">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mr-4">
            <span className="material-icons text-blue-600">savings</span>
          </div>
          <h2 className="text-2xl font-bold text-neutral-800">Investing Basics</h2>
        </div>

        <Tabs defaultValue="intro" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="intro">Introduction</TabsTrigger>
            <TabsTrigger value="types">Investment Types</TabsTrigger>
            <TabsTrigger value="risk">Risk & Return</TabsTrigger>
            <TabsTrigger value="strategy">Getting Started</TabsTrigger>
          </TabsList>
          
          <TabsContent value="intro">
            <Card>
              <CardContent className="p-6 prose max-w-none">
                <h3>What is Investing?</h3>
                <p>
                  Investing is the act of allocating resources, usually money, with the expectation of generating income or profit over time. Unlike saving, which involves putting money aside for future use with minimal risk, investing involves some level of risk in pursuit of potential returns.
                </p>
                
                <h3>Why Invest?</h3>
                <p>
                  The primary reasons to invest include:
                </p>
                <ul>
                  <li><strong>Growing wealth:</strong> Investments typically offer higher returns than savings accounts, allowing your money to grow faster over time.</li>
                  <li><strong>Beating inflation:</strong> The cost of goods and services tends to rise over time. Investments help your money maintain and increase its purchasing power.</li>
                  <li><strong>Achieving financial goals:</strong> Whether it's retirement, buying a home, or funding education, investing can help you reach these significant financial milestones.</li>
                  <li><strong>Creating passive income:</strong> Many investments generate regular income without requiring constant work.</li>
                </ul>
                
                <h3>The Power of Compound Interest</h3>
                <p>
                  Albert Einstein reportedly called compound interest "the eighth wonder of the world." Compound interest occurs when you earn interest not just on your initial investment, but also on the interest already accumulated. This creates a snowball effect that can significantly increase your wealth over time.
                </p>
                <p>
                  For example, $10,000 invested at a 7% annual return would grow to approximately $76,123 after 30 years, even without adding any additional money. This demonstrates why starting to invest early is so beneficial.
                </p>
                
                <div className="bg-blue-50 p-4 rounded-md border border-blue-100 my-6">
                  <h4 className="text-blue-800 font-medium flex items-center mb-2">
                    <span className="material-icons mr-1 text-blue-600">lightbulb</span>
                    Key Insight
                  </h4>
                  <p className="text-blue-700 mb-0">
                    Time in the market beats timing the market. The longer your money is invested, the more opportunity it has to grow and weather market fluctuations.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="types">
            <Card>
              <CardContent className="p-6 prose max-w-none">
                <h3>Common Investment Types</h3>
                
                <h4>Stocks (Equities)</h4>
                <p>
                  When you buy a stock, you purchase a share of ownership in a company. Stocks can provide returns through:
                </p>
                <ul>
                  <li><strong>Price appreciation:</strong> The value of your shares increases</li>
                  <li><strong>Dividends:</strong> Regular payments of company profits to shareholders</li>
                </ul>
                <p>
                  Stocks generally offer higher potential returns but come with higher volatility and risk.
                </p>
                
                <h4>Bonds (Fixed Income)</h4>
                <p>
                  Bonds are essentially loans to companies or governments. When you buy a bond, you're lending money to the issuer in exchange for regular interest payments and the return of the principal when the bond matures.
                </p>
                <p>
                  Bonds typically offer more stable, predictable returns than stocks but with lower long-term growth potential.
                </p>
                
                <h4>Mutual Funds and ETFs</h4>
                <p>
                  These investment vehicles pool money from many investors to purchase a diversified portfolio of stocks, bonds, or other securities.
                </p>
                <ul>
                  <li><strong>Mutual funds</strong> are typically bought and sold at the end of the trading day at a price based on the fund's net asset value (NAV).</li>
                  <li><strong>Exchange-Traded Funds (ETFs)</strong> trade throughout the day like individual stocks and often have lower expense ratios than mutual funds.</li>
                </ul>
                <p>
                  Both provide instant diversification and professional management, making them excellent choices for beginners.
                </p>
                
                <h4>Real Estate</h4>
                <p>
                  Real estate investments can include:
                </p>
                <ul>
                  <li>Physical property (residential or commercial)</li>
                  <li>Real Estate Investment Trusts (REITs)</li>
                  <li>Real estate crowdfunding platforms</li>
                </ul>
                <p>
                  Real estate can provide both appreciation and income through rent or lease payments.
                </p>
                
                <h4>Cash Equivalents</h4>
                <p>
                  These are low-risk, highly liquid investments such as:
                </p>
                <ul>
                  <li>Money market funds</li>
                  <li>Certificates of deposit (CDs)</li>
                  <li>Treasury bills</li>
                </ul>
                <p>
                  While they offer minimal risk, they typically provide returns that barely keep pace with inflation.
                </p>
                
                <div className="bg-blue-50 p-4 rounded-md border border-blue-100 my-6">
                  <h4 className="text-blue-800 font-medium flex items-center mb-2">
                    <span className="material-icons mr-1 text-blue-600">tips_and_updates</span>
                    Pro Tip
                  </h4>
                  <p className="text-blue-700 mb-0">
                    For most beginning investors, a low-cost index fund that tracks a broad market index (like the S&P 500) is an excellent place to start. It provides instant diversification, low fees, and has historically provided solid returns over the long term.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="risk">
            <Card>
              <CardContent className="p-6 prose max-w-none">
                <h3>Understanding Risk and Return</h3>
                
                <p>
                  In investing, risk and return are closely related. Generally, investments with higher potential returns come with higher risk of losses. Understanding this relationship is crucial for building a portfolio that matches your financial goals and risk tolerance.
                </p>
                
                <h4>Types of Investment Risk</h4>
                <ul>
                  <li><strong>Market risk:</strong> The possibility that investments will decline due to market factors like economic downturns or political events</li>
                  <li><strong>Inflation risk:</strong> The chance that your investment returns won't keep pace with inflation, reducing your purchasing power</li>
                  <li><strong>Liquidity risk:</strong> The risk of not being able to sell an investment quickly without significant loss</li>
                  <li><strong>Concentration risk:</strong> The danger of having too much exposure to a single investment or sector</li>
                  <li><strong>Interest rate risk:</strong> The potential for investments (especially bonds) to decrease in value when interest rates rise</li>
                </ul>
                
                <h4>Risk Tolerance</h4>
                <p>
                  Your risk tolerance depends on several factors:
                </p>
                <ul>
                  <li><strong>Time horizon:</strong> Generally, the longer your investment timeframe, the more risk you can afford to take</li>
                  <li><strong>Financial situation:</strong> Your income stability, emergency savings, and overall financial health</li>
                  <li><strong>Psychological comfort:</strong> Your emotional ability to handle market volatility without making impulsive decisions</li>
                </ul>
                
                <h4>Managing Risk Through Diversification</h4>
                <p>
                  Diversification is the practice of spreading your investments across various asset classes, sectors, and geographic regions to reduce risk. The core principle is that not all investments perform well or poorly at the same time, so having a mix can help smooth out returns.
                </p>
                
                <p>
                  Effective diversification might include:
                </p>
                <ul>
                  <li>Different asset classes (stocks, bonds, real estate)</li>
                  <li>Various sectors (technology, healthcare, financial services)</li>
                  <li>Domestic and international markets</li>
                  <li>Companies of different sizes (large-cap, mid-cap, small-cap)</li>
                </ul>
                
                <div className="bg-amber-50 p-4 rounded-md border border-amber-100 my-6">
                  <h4 className="text-amber-800 font-medium flex items-center mb-2">
                    <span className="material-icons mr-1 text-amber-600">warning</span>
                    Important Note
                  </h4>
                  <p className="text-amber-700 mb-0">
                    While diversification can reduce risk, it cannot eliminate it entirely. All investments carry some level of risk, and even a well-diversified portfolio will experience ups and downs.
                  </p>
                </div>
                
                <h4>The Risk-Return Spectrum</h4>
                <p>
                  Different investments fall along a spectrum of risk and potential return:
                </p>
                <ul>
                  <li><strong>Lower risk, lower return:</strong> Cash, CDs, Treasury bonds</li>
                  <li><strong>Medium risk, medium return:</strong> Corporate bonds, balanced mutual funds, blue-chip stocks</li>
                  <li><strong>Higher risk, higher potential return:</strong> Small-cap stocks, international stocks, sector-specific investments, cryptocurrencies</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="strategy">
            <Card>
              <CardContent className="p-6 prose max-w-none">
                <h3>Getting Started with Investing</h3>
                
                <h4>Step 1: Establish Your Financial Foundation</h4>
                <p>
                  Before investing, ensure you have:
                </p>
                <ul>
                  <li>An emergency fund covering 3-6 months of expenses</li>
                  <li>Paid off high-interest debt (especially credit cards)</li>
                  <li>Clear financial goals with specific timeframes</li>
                </ul>
                
                <h4>Step 2: Determine Your Asset Allocation</h4>
                <p>
                  Based on your goals, time horizon, and risk tolerance, decide how to divide your investments among different asset classes.
                </p>
                <p>
                  A common starting point is the "100 minus your age" rule for stock allocation. For example, if you're 30 years old, you might consider allocating roughly 70% to stocks and 30% to bonds. However, this is just a guideline and should be adjusted based on your personal circumstances.
                </p>
                
                <h4>Step 3: Choose an Investment Account</h4>
                <ul>
                  <li><strong>Retirement accounts:</strong> 401(k), 403(b), IRA, or Roth IRA offer tax advantages but may have restrictions on withdrawals</li>
                  <li><strong>Taxable brokerage accounts:</strong> More flexible but lack tax advantages</li>
                  <li><strong>Robo-advisors:</strong> Automated platforms that create and manage a diversified portfolio based on your goals</li>
                </ul>
                
                <h4>Step 4: Select Your Investments</h4>
                <p>
                  For most beginners, these options provide excellent starting points:
                </p>
                <ul>
                  <li><strong>Index funds:</strong> Passively managed funds that track market indexes (like S&P 500)</li>
                  <li><strong>ETFs:</strong> Similar to index funds but trade like stocks throughout the day</li>
                  <li><strong>Target-date funds:</strong> Automatically adjust asset allocation based on your target retirement date</li>
                </ul>
                
                <h4>Step 5: Implement a Regular Investment Strategy</h4>
                <p>
                  Consider using dollar-cost averaging by investing a fixed amount regularly, regardless of market conditions. This strategy:
                </p>
                <ul>
                  <li>Reduces the impact of market volatility</li>
                  <li>Removes the emotional aspect of trying to time the market</li>
                  <li>Creates a disciplined approach to building wealth</li>
                </ul>
                
                <h4>Step 6: Monitor and Rebalance</h4>
                <p>
                  Review your portfolio periodically (semi-annually or annually) and rebalance if necessary to maintain your target asset allocation. Avoid checking too frequently, as this can lead to emotional decision-making based on short-term market movements.
                </p>
                
                <div className="bg-green-50 p-4 rounded-md border border-green-100 my-6">
                  <h4 className="text-green-800 font-medium flex items-center mb-2">
                    <span className="material-icons mr-1 text-green-600">check_circle</span>
                    Getting Started Checklist
                  </h4>
                  <ul className="text-green-700 mb-0 pl-5 list-disc">
                    <li>Establish emergency fund</li>
                    <li>Pay off high-interest debt</li>
                    <li>Determine investment goals and time horizon</li>
                    <li>Open an appropriate investment account</li>
                    <li>Set up automatic contributions</li>
                    <li>Start with broad-based index funds or ETFs</li>
                    <li>Schedule regular portfolio reviews</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div id="credit" className="mb-16 scroll-mt-16">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mr-4">
            <span className="material-icons text-orange-600">credit_card</span>
          </div>
          <h2 className="text-2xl font-bold text-neutral-800">Credit & Debt Management</h2>
        </div>

        <Card>
          <CardContent className="p-6 prose max-w-none">
            <h3>Understanding Credit Scores</h3>
            <p>
              Your credit score is a number that represents your creditworthiness to lenders. The most common credit scoring model is FICO, with scores ranging from 300 to 850.
            </p>

            <h4>Factors That Affect Your Credit Score:</h4>
            <ul>
              <li><strong>Payment history (35%):</strong> Whether you've paid past credit accounts on time</li>
              <li><strong>Credit utilization (30%):</strong> The percentage of your available credit that you're using</li>
              <li><strong>Length of credit history (15%):</strong> How long you've been using credit</li>
              <li><strong>New credit (10%):</strong> Recently opened accounts and credit inquiries</li>
              <li><strong>Credit mix (10%):</strong> The variety of credit accounts you have</li>
            </ul>

            <div className="bg-green-50 p-4 rounded-md border border-green-100 my-6">
              <h4 className="text-green-800 font-medium flex items-center mb-2">
                <span className="material-icons mr-1 text-green-600">tips_and_updates</span>
                Tips to Improve Your Credit Score
              </h4>
              <ul className="text-green-700 mb-0 pl-5 list-disc">
                <li>Pay all bills on time, every time</li>
                <li>Keep credit card balances below 30% of your credit limits</li>
                <li>Don't close old credit accounts, even if unused</li>
                <li>Apply for new credit only when necessary</li>
                <li>Regularly monitor your credit reports for errors</li>
              </ul>
            </div>

            <h3>Effective Debt Repayment Strategies</h3>

            <h4>The Debt Avalanche Method</h4>
            <p>
              With this approach, you:
            </p>
            <ol>
              <li>Make minimum payments on all debts</li>
              <li>Put extra money toward the debt with the highest interest rate</li>
              <li>Once that debt is paid off, apply that payment to the next highest-rate debt</li>
            </ol>
            <p>
              <strong>Advantage:</strong> Minimizes total interest paid and typically saves the most money overall.
            </p>

            <h4>The Debt Snowball Method</h4>
            <p>
              With this approach, you:
            </p>
            <ol>
              <li>Make minimum payments on all debts</li>
              <li>Put extra money toward the debt with the smallest balance</li>
              <li>Once that debt is paid off, apply that payment to the next smallest debt</li>
            </ol>
            <p>
              <strong>Advantage:</strong> Quick wins provide psychological motivation to continue the debt payoff journey.
            </p>

            <h4>Debt Consolidation Options</h4>
            <ul>
              <li><strong>Personal loans:</strong> Can provide a fixed interest rate, often lower than credit cards</li>
              <li><strong>Balance transfer credit cards:</strong> Offer low or 0% introductory rates for a limited time</li>
              <li><strong>Home equity loans/lines of credit:</strong> May offer lower rates but put your home at risk</li>
              <li><strong>Debt management plans:</strong> Nonprofit credit counseling agencies can work with creditors to reduce interest rates</li>
            </ul>

            <div className="bg-amber-50 p-4 rounded-md border border-amber-100 my-6">
              <h4 className="text-amber-800 font-medium flex items-center mb-2">
                <span className="material-icons mr-1 text-amber-600">warning</span>
                Warning Signs of Debt Problems
              </h4>
              <ul className="text-amber-700 mb-0 pl-5 list-disc">
                <li>Using credit cards for basic necessities</li>
                <li>Only making minimum payments each month</li>
                <li>Regularly exceeding 30% credit utilization</li>
                <li>Being denied for new credit</li>
                <li>Feeling stress or anxiety about your finances</li>
              </ul>
            </div>

            <h3>Creating a Debt Repayment Plan</h3>
            <ol>
              <li><strong>List all debts</strong> with their balances, interest rates, and minimum payments</li>
              <li><strong>Review your budget</strong> to identify how much extra you can put toward debt</li>
              <li><strong>Choose a strategy</strong> (avalanche or snowball) that works for your situation</li>
              <li><strong>Explore consolidation options</strong> if they would simplify payments or reduce interest</li>
              <li><strong>Set up automatic payments</strong> to ensure you never miss a due date</li>
              <li><strong>Track your progress</strong> regularly to stay motivated</li>
              <li><strong>Avoid new debt</strong> while paying off existing balances</li>
            </ol>

            <p>
              Remember that becoming debt-free is a journey. Celebrate small victories along the way and stay committed to your plan. As you reduce your debt burden, you'll have more financial flexibility to save and invest for your future goals.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
