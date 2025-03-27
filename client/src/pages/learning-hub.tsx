import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  BookOpenIcon, 
  GraduationCapIcon,
  BarChart4Icon,
  LineChartIcon,
  ArrowUpRightIcon,
  PlayCircleIcon,
  SearchIcon,
  BookmarkIcon
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";

export default function LearningHub() {
  const [initialInvestment, setInitialInvestment] = useState(1000);
  const [monthlyContribution, setMonthlyContribution] = useState(100);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(7);
  const [simulationResults, setSimulationResults] = useState<number | null>(null);

  const runInvestmentSimulation = () => {
    let total = initialInvestment;
    const monthlyRate = rate / 100 / 12;
    const totalMonths = years * 12;
    
    for (let i = 0; i < totalMonths; i++) {
      total = total * (1 + monthlyRate) + monthlyContribution;
    }
    
    setSimulationResults(Math.round(total));
  };

  const tutorials = [
    {
      id: 1,
      title: "Understanding Compound Interest",
      category: "Basics",
      duration: "10 min",
      level: "Beginner",
      progress: 0,
      description: "Learn how compound interest works and why it's the most powerful force in investing."
    },
    {
      id: 2,
      title: "Budgeting Fundamentals",
      category: "Personal Finance",
      duration: "15 min",
      level: "Beginner",
      progress: 35,
      description: "Master the basics of creating and maintaining a personal budget."
    },
    {
      id: 3,
      title: "Introduction to Stock Market",
      category: "Investing",
      duration: "20 min",
      level: "Intermediate",
      progress: 75,
      description: "Understand how the stock market works and how to start investing."
    },
    {
      id: 4,
      title: "Retirement Planning 101",
      category: "Planning",
      duration: "25 min",
      level: "Beginner",
      progress: 20,
      description: "Learn essential strategies for planning your retirement."
    },
    {
      id: 5,
      title: "Advanced Tax Strategies",
      category: "Taxes",
      duration: "30 min",
      level: "Advanced",
      progress: 0,
      description: "Discover legal ways to minimize your tax burden and optimize your finances."
    },
    {
      id: 6,
      title: "Debt Elimination Strategies",
      category: "Personal Finance",
      duration: "18 min",
      level: "Intermediate",
      progress: 0,
      description: "Practical approaches to systematically eliminate debt and regain financial freedom."
    }
  ];

  const caseStudies = [
    {
      id: 1,
      title: "The Early Investor",
      scenario: "Alex starts investing $200 monthly at age 25 vs. Jordan who waits until 35.",
      keyInsight: "Starting 10 years earlier results in nearly double the retirement savings."
    },
    {
      id: 2,
      title: "Debt Snowball vs. Avalanche",
      scenario: "Compare two popular debt repayment strategies across different debt profiles.",
      keyInsight: "Avalanche saves more money, but the snowball method provides psychological wins."
    },
    {
      id: 3,
      title: "Housing: Buy vs. Rent",
      scenario: "Evaluate the financial implications of buying a home versus renting long-term.",
      keyInsight: "The decision depends on location, time horizon, and opportunity cost of invested down payment."
    },
    {
      id: 4,
      title: "Traditional vs. Roth Retirement",
      scenario: "Compare tax-deferred and post-tax retirement contributions under different income trajectories.",
      keyInsight: "Tax rate in retirement versus working years is the critical decision factor."
    }
  ];

  const glossaryTerms = [
    { term: "APR", definition: "Annual Percentage Rate - The yearly rate charged for borrowing, expressed as a percentage." },
    { term: "Asset Allocation", definition: "The strategy of dividing investments among different asset categories to balance risk and reward." },
    { term: "Bear Market", definition: "A market condition in which prices are falling or expected to fall, typically by 20% or more." },
    { term: "Bull Market", definition: "A market condition in which prices are rising or expected to rise." },
    { term: "Capital Gain", definition: "The profit from selling an asset for more than its purchase price." },
    { term: "Diversification", definition: "Spreading investments across various financial instruments to reduce risk." },
    { term: "FICO Score", definition: "A credit score created by the Fair Isaac Corporation, ranging from 300 to 850." },
    { term: "IRA", definition: "Individual Retirement Account - A tax-advantaged investment account for retirement savings." },
    { term: "Liquidity", definition: "The ease with which an asset can be converted to cash without affecting its market price." },
    { term: "Market Capitalization", definition: "The total dollar value of a company's outstanding shares." },
    { term: "P/E Ratio", definition: "Price-to-Earnings Ratio - A company's share price divided by its earnings per share." },
    { term: "Volatility", definition: "The degree of variation in a trading price series over time, often measured by standard deviation." }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 mb-2">Integrated Educational Hub</h1>
        <p className="text-neutral-600">Expand your financial knowledge with interactive learning tools and resources</p>
      </div>

      <Tabs defaultValue="tutorials" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="tutorials" className="flex items-center gap-2">
            <BookOpenIcon className="h-4 w-4" />
            <span>Learning Resources</span>
          </TabsTrigger>
          <TabsTrigger value="case-studies" className="flex items-center gap-2">
            <GraduationCapIcon className="h-4 w-4" />
            <span>Case Studies</span>
          </TabsTrigger>
          <TabsTrigger value="tools" className="flex items-center gap-2">
            <LineChartIcon className="h-4 w-4" />
            <span>Interactive Tools</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tutorials">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorials.map(tutorial => (
              <Card key={tutorial.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center mb-2">
                    <Badge variant={tutorial.level === "Beginner" ? "default" : 
                           tutorial.level === "Intermediate" ? "secondary" : "destructive"}>
                      {tutorial.level}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{tutorial.duration}</span>
                  </div>
                  <CardTitle className="text-xl">{tutorial.title}</CardTitle>
                  <CardDescription>{tutorial.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-2 text-sm">
                    <span className="text-muted-foreground">{tutorial.category}</span>
                    <span>{tutorial.progress > 0 ? `${tutorial.progress}% complete` : "Not started"}</span>
                  </div>
                  <Progress value={tutorial.progress} className="h-2" />
                </CardContent>
                <CardFooter className="bg-muted/50 pt-3">
                  <Button variant="ghost" className="w-full flex items-center gap-2">
                    {tutorial.progress > 0 ? "Continue" : "Start"} <PlayCircleIcon className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}

            <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
              <CardContent className="flex flex-col items-center justify-center h-full py-8">
                <div className="p-3 rounded-full bg-muted mb-4">
                  <SearchIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <CardTitle className="text-xl mb-2">Explore More</CardTitle>
                <CardDescription className="text-center mb-4">
                  Browse our full catalog of financial education resources
                </CardDescription>
                <Button variant="outline">View All Tutorials</Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Financial Glossary</h2>
              <Button variant="outline" size="sm">View All Terms</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {glossaryTerms.slice(0, 6).map((item, idx) => (
                <Dialog key={idx}>
                  <DialogTrigger asChild>
                    <div className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{item.term}</h3>
                        <ArrowUpRightIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                        {item.definition}
                      </p>
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{item.term}</DialogTitle>
                      <DialogDescription>
                        {item.definition}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Usage Example:</h4>
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                        "Understanding {item.term.toLowerCase()} is important because it directly affects your financial decisions when {item.term.toLowerCase() === "apr" ? "taking out loans" : 
                        item.term.toLowerCase() === "diversification" ? "building your investment portfolio" :
                        item.term.toLowerCase() === "fico score" ? "applying for credit" : "managing your finances"}."
                      </p>
                      <div className="flex justify-end mt-4">
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <BookmarkIcon className="h-4 w-4" /> Save to My Terms
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="case-studies">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {caseStudies.map(study => (
              <Card key={study.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="bg-primary/5 border-b">
                  <CardTitle className="text-xl">{study.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">SCENARIO</h3>
                    <p>{study.scenario}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">KEY INSIGHT</h3>
                    <p className="text-sm bg-muted p-3 rounded-md">{study.keyInsight}</p>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/50 pt-3 flex justify-between">
                  <Button variant="ghost" className="flex items-center gap-2">
                    Explore Case Study <ArrowUpRightIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    Save
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-12 bg-muted/30 rounded-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="md:w-2/3">
                <h2 className="text-2xl font-bold mb-2">Create Your Own Case Study</h2>
                <p className="text-muted-foreground mb-4">
                  Apply what you've learned to your personal financial situation. Our tools help you create custom scenarios based on your specific goals and circumstances.
                </p>
                <div className="flex gap-3">
                  <Button>Get Started</Button>
                  <Button variant="outline">View Examples</Button>
                </div>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <BarChart4Icon className="h-16 w-16 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tools">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Investment Simulator</CardTitle>
                <CardDescription>
                  See how your investments could grow over time with regular contributions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="initialInvestment">Initial Investment: ${initialInvestment}</Label>
                    <Slider
                      id="initialInvestment"
                      min={0}
                      max={50000}
                      step={100}
                      value={[initialInvestment]}
                      onValueChange={(values) => setInitialInvestment(values[0])}
                      className="my-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>$0</span>
                      <span>$50,000</span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="monthlyContribution">Monthly Contribution: ${monthlyContribution}</Label>
                    <Slider
                      id="monthlyContribution"
                      min={0}
                      max={1000}
                      step={10}
                      value={[monthlyContribution]}
                      onValueChange={(values) => setMonthlyContribution(values[0])}
                      className="my-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>$0</span>
                      <span>$1,000</span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="investmentYears">Time Period: {years} years</Label>
                    <Slider
                      id="investmentYears"
                      min={1}
                      max={40}
                      step={1}
                      value={[years]}
                      onValueChange={(values) => setYears(values[0])}
                      className="my-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1 year</span>
                      <span>40 years</span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="investmentRate">Annual Return Rate: {rate}%</Label>
                    <Slider
                      id="investmentRate"
                      min={1}
                      max={15}
                      step={0.5}
                      value={[rate]}
                      onValueChange={(values) => setRate(values[0])}
                      className="my-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1%</span>
                      <span>15%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col">
                <Button onClick={runInvestmentSimulation} className="w-full mb-4">
                  Calculate Results
                </Button>
                
                {simulationResults && (
                  <div className="bg-muted p-4 rounded-lg w-full">
                    <h3 className="font-medium text-center mb-2">Projected Value</h3>
                    <p className="text-3xl font-bold text-center text-primary">
                      ${simulationResults.toLocaleString()}
                    </p>
                    <p className="text-xs text-center text-muted-foreground mt-2">
                      Total contributions: ${(initialInvestment + (monthlyContribution * 12 * years)).toLocaleString()}
                    </p>
                  </div>
                )}
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Milestone Calculator</CardTitle>
                <CardDescription>
                  Find out how long it will take to reach your important financial goals.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="goalAmount">Goal Amount</Label>
                    <div className="flex items-center mt-1.5">
                      <span className="bg-muted px-3 py-2 rounded-l-md border-y border-l">$</span>
                      <Input id="goalAmount" type="number" placeholder="50000" className="rounded-l-none" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="currentSavings">Current Savings</Label>
                    <div className="flex items-center mt-1.5">
                      <span className="bg-muted px-3 py-2 rounded-l-md border-y border-l">$</span>
                      <Input id="currentSavings" type="number" placeholder="10000" className="rounded-l-none" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="monthlySavings">Monthly Contribution</Label>
                    <div className="flex items-center mt-1.5">
                      <span className="bg-muted px-3 py-2 rounded-l-md border-y border-l">$</span>
                      <Input id="monthlySavings" type="number" placeholder="500" className="rounded-l-none" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="interestRate">Expected Annual Return (%)</Label>
                    <div className="flex items-center mt-1.5">
                      <Input id="interestRate" type="number" placeholder="7" className="rounded-r-none" />
                      <span className="bg-muted px-3 py-2 rounded-r-md border-y border-r">%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Calculate Time to Goal</Button>
              </CardFooter>
            </Card>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Debt Repayment Strategy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Compare the snowball and avalanche methods to find the best way to eliminate your debt.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Open Tool</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Retirement Calculator</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Project your retirement savings and determine if you're on track to meet your goals.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Open Tool</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Buy vs. Rent Calculator</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Compare the financial implications of buying a home versus renting over time.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Open Tool</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}