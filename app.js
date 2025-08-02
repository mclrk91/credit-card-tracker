import React, { useState, useEffect } from 'react'
import { Calendar, CreditCard, Gift, Plane, DollarSign, AlertCircle, Target, Coffee, CheckCircle2, X, Menu, ChevronRight, TrendingUp, Shield, Clock, Star, Edit2, Plus, Trash2, Download, Link, User, Save, Search, ChevronUp, ChevronDown, MessageSquare } from 'lucide-react'

function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [editMode, setEditMode] = useState(false)
  const [loyaltyEditMode, setLoyaltyEditMode] = useState(false)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [loyaltySearch, setLoyaltySearch] = useState('')
  const [sheetData, setSheetData] = useState(null)
  const [loadingSheet, setLoadingSheet] = useState(false)
  
  // Google Sheets ID from the URL
  const SHEET_ID = '10qMF_SrVUJXSrQigRqPnhAIlXiyW2D3OdwbS0kYYF_w'
  const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`
  
  // Persist benefits across sessions
  const [benefitsChecked, setBenefitsChecked] = useState(() => {
    const saved = localStorage.getItem('benefitsChecked')
    return saved ? JSON.parse(saved) : {}
  })
  
  // Points balances
  const [pointsBalances, setPointsBalances] = useState(() => {
    const saved = localStorage.getItem('pointsBalances')
    return saved ? JSON.parse(saved) : {
      'Marissa Amex': 504960,
      'Jack Amex': 105038,
      'Marissa Chase Business': 384280,
      'Marissa Chase Personal': 56838,
      'Etihad': 13000,
      'Marissa Delta': 4466,
      'Marissa Virgin Atlantic': 32222,
      'Marissa Jet Blue': 3529,
      'Marissa British Airways': 5718,
      'Marissa United': 1170,
      'Marissa Bilt': 622,
      'Marissa Marriott': 6607,
      'Marissa Hilton': 6116,
      'Marissa IHG': 1973,
      'Marissa Hyatt': 10028
    }
  })

  // Loyalty numbers state - reorganized to group by program
  const [loyaltyNumbers, setLoyaltyNumbers] = useState(() => {
    const saved = localStorage.getItem('loyaltyNumbers')
    return saved ? JSON.parse(saved) : {
      'knownTraveler': [
        { id: 1, name: 'Mike (Dad)', number: '157461621', category: 'Known Traveler' },
        { id: 2, name: 'Tonya (Mom)', number: '157367880', category: 'Known Traveler' },
        { id: 3, name: 'Marissa', number: '159481933', category: 'Known Traveler' },
        { id: 4, name: 'Jack', number: '159484492', category: 'Known Traveler' }
      ],
      'airlines': [
        // United
        { id: 5, name: 'Jack', number: 'XFS19203', category: 'United', subcategory: 'United' },
        { id: 11, name: 'Marissa', number: 'FZS48862', category: 'United', subcategory: 'United', points: '1,170' },
        
        // Delta
        { id: 9, name: 'Marissa', number: '9159698753', category: 'Delta', subcategory: 'Delta', points: '4,466' },
        { id: 21, name: 'Jack', number: '9424346279', category: 'Delta', subcategory: 'Delta' },
        { id: 10, name: 'Mike', number: '2078330905', category: 'Delta', subcategory: 'Delta' },
        
        // Singapore Airlines
        { id: 7, name: 'Marissa', number: '8169579028', category: 'Singapore Airlines KrisFlyer', subcategory: 'Singapore' },
        { id: 8, name: 'Jack', number: '8844793977', category: 'Singapore Airlines KrisFlyer', subcategory: 'Singapore' },
        
        // Virgin Atlantic
        { id: 22, name: 'Jack', number: '1093846416', category: 'Virgin Atlantic', subcategory: 'Virgin' },
        { id: 23, name: 'Marissa', number: '1093798799', category: 'Virgin Atlantic', subcategory: 'Virgin', points: '32,222' },
        
        // British Airways
        { id: 25, name: 'Marissa', number: '06497776', category: 'British Airways', subcategory: 'BA', points: '5,718' },
        { id: 26, name: 'Jack', number: '90228232', category: 'British Airways', subcategory: 'BA' },
        
        // American Airlines
        { id: 13, name: 'Marissa', number: 'U501KD0', category: 'American Airlines', subcategory: 'AA', points: '560' },
        { id: 14, name: 'Jack', number: 'AU9T302', category: 'American Airlines', subcategory: 'AA' },
        
        // Air France/Flying Blue
        { id: 17, name: 'Jack', number: '5266076770', category: 'Air France Flying Blue', subcategory: 'Flying Blue' },
        { id: 18, name: 'Marissa', number: '5218994350', category: 'Air France Flying Blue', subcategory: 'Flying Blue' },
        
        // Other airlines
        { id: 6, name: 'Marissa', number: '500078965304', category: 'Etihad', subcategory: 'Other', points: '13,000' },
        { id: 12, name: 'Marissa', number: '122789597', category: 'Air Canada Aeroplan', subcategory: 'Other' },
        { id: 15, name: 'Spirit', number: '1008660379', category: 'Spirit Free Spirit', subcategory: 'Other', points: '0' },
        { id: 16, name: 'Marissa', number: '807872891', category: 'Qatar', subcategory: 'Other' },
        { id: 19, name: 'JetBlue', number: '3990361422', category: 'JetBlue TrueBlue', subcategory: 'Other', points: '3,529' },
        { id: 20, name: 'Southwest', number: '20136566004', category: 'Southwest Rapid Rewards', subcategory: 'Other' },
        { id: 24, name: 'ANA', number: '4132758605', category: 'ANA Mileage Club', subcategory: 'Other' },
        { id: 27, name: 'Breeze', number: '2200629268', category: 'Breeze Points', subcategory: 'Other', points: '1,924' }
      ],
      'hotels': [
        { id: 28, name: 'Marriott Bonvoy', number: '837276489', category: 'Marriott', points: '6,607' },
        { id: 29, name: 'Hilton Honors', number: '1434554786', category: 'Hilton', points: '6,116' },
        { id: 30, name: 'IHG Club', number: '254873052', category: 'IHG', points: '1,973' },
        { id: 31, name: 'Wyndham', number: '198400419J', category: 'Wyndham' },
        { id: 32, name: 'World of Hyatt', number: '557111799O', category: 'Hyatt', points: '10,028' },
        { id: 33, name: 'Preferred Hotels', number: 'PHKCTPA66R', category: 'Preferred Hotels' }
      ],
      'other': [
        { id: 34, name: 'Amtrak Guest Rewards', number: '9039753745', category: 'Amtrak' },
        { id: 35, name: 'Frontier', number: '90097336269', category: 'Frontier', points: '4,661' },
        { id: 36, name: 'Sun Country', number: '601038892', category: 'Sun Country' },
        { id: 37, name: 'Carnival VIFP', number: '36153904', category: 'Carnival', points: '20' },
        { id: 38, name: 'Holland America', number: '051348977', category: 'Holland America' },
        { id: 39, name: 'Marissa Bilt', number: 'TBD', category: 'Bilt', points: '622' }
      ]
    }
  })

  // Referral links state
  const [referralLinks, setReferralLinks] = useState(() => {
    const saved = localStorage.getItem('referralLinks')
    return saved ? JSON.parse(saved) : []
  })

  // Save states to localStorage
  useEffect(() => {
    localStorage.setItem('benefitsChecked', JSON.stringify(benefitsChecked))
  }, [benefitsChecked])

  useEffect(() => {
    localStorage.setItem('pointsBalances', JSON.stringify(pointsBalances))
  }, [pointsBalances])

  useEffect(() => {
    localStorage.setItem('loyaltyNumbers', JSON.stringify(loyaltyNumbers))
  }, [loyaltyNumbers])

  useEffect(() => {
    localStorage.setItem('referralLinks', JSON.stringify(referralLinks))
  }, [referralLinks])

  // Fetch Google Sheets data
  const fetchSheetData = async () => {
    setLoadingSheet(true)
    try {
      const response = await fetch(SHEET_URL)
      const text = await response.text()
      
      // Parse CSV data
      const lines = text.split('\n')
      const headers = lines[0].split(',')
      const data = lines.slice(1).map(line => {
        const values = line.split(',')
        const row = {}
        headers.forEach((header, index) => {
          row[header.trim()] = values[index]?.trim() || ''
        })
        return row
      }).filter(row => row['Card Name']) // Filter out empty rows
      
      setSheetData(data)
      console.log('Sheet data loaded:', data)
    } catch (error) {
      console.error('Error loading sheet data:', error)
      alert('Unable to load Google Sheets data. Using default data.')
    }
    setLoadingSheet(false)
  }

  // Handler functions
  const handleBenefitCheck = (benefitId) => {
    setBenefitsChecked(prev => ({
      ...prev,
      [benefitId]: !prev[benefitId]
    }))
  }

  const handlePointsUpdate = (program, value) => {
    setPointsBalances(prev => ({
      ...prev,
      [program]: parseInt(value) || 0
    }))
  }

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  // Card data with closed date for Rose Gold
  const baseCardData = [
    // Marissa's cards (newest to oldest)
    { person: 'Marissa', name: 'AMEX Gold Personal', digits: '21000', opened: '7/19/25', openedDate: new Date('2025-07-19'), fee: '$325', feeNum: 325, business: 'Personal', limit: 'N/A' },
    { person: 'Marissa', name: 'Chase Ink Business Preferred® (Scoop Hero)', digits: '2429', opened: '9/4/24', openedDate: new Date('2024-09-04'), fee: '$95', feeNum: 95, business: 'Scoop Hero', limit: '$9,100' },
    { person: 'Marissa', name: 'IHG ONE REWARDS Premier', digits: '4406', opened: '8/3/24', openedDate: new Date('2024-08-03'), fee: '$99', feeNum: 99, business: 'Personal', limit: '$12,000' },
    { person: 'Marissa', name: 'AMEX Business Gold Rose', digits: '21007', opened: '6/24/24', openedDate: new Date('2024-06-24'), fee: '$375', feeNum: 375, business: 'PDL', limit: 'N/A', closed: true, closedDate: '8/1/25' },
    { person: 'Marissa', name: 'Chase Ink Business Preferred', digits: '5921', opened: '4/4/24', openedDate: new Date('2024-04-04'), fee: '$95', feeNum: 95, business: 'Scoop Hero', limit: '$10,800' },
    { person: 'Marissa', name: 'Chase Sapphire Preferred (Jack AU)', digits: '8145', opened: '3/4/24', openedDate: new Date('2024-03-04'), fee: '$95', feeNum: 95, business: 'Personal', limit: '$12,000' },
    { person: 'Marissa', name: 'Chase Ink Business Preferred', digits: '7589', opened: '2/5/25', openedDate: new Date('2025-02-05'), fee: '$95', feeNum: 95, business: 'PDL', limit: '$5,000' },
    { person: 'Marissa', name: 'AMEX Business Gold', digits: '51007', opened: '1/31/24', openedDate: new Date('2024-01-31'), fee: '$375', feeNum: 375, business: 'PDL', limit: 'N/A' },
    { person: 'Marissa', name: 'AMEX Business Platinum', digits: '2002', opened: '12/18/23', openedDate: new Date('2023-12-18'), fee: '$695', feeNum: 695, business: 'PDL', limit: 'N/A' },
    { person: 'Marissa', name: 'Chase Ink Business Preferred', digits: '6565', opened: '12/19/23', openedDate: new Date('2023-12-19'), fee: '$95', feeNum: 95, business: 'PDL', limit: '$8,000' },
    { person: 'Marissa', name: 'Capital One Platinum', digits: '2485', opened: '12/11/19', openedDate: new Date('2019-12-11'), fee: '$0', feeNum: 0, business: 'Personal', limit: '$500' },
    { person: 'Marissa', name: 'Capital One QuicksilverOne', digits: '5291', opened: '1/27/19', openedDate: new Date('2019-01-27'), fee: '$39', feeNum: 39, business: 'Personal', limit: '$5,500', renewal: 'Feb 2026' },
    { person: 'Marissa', name: '❗ Discover IT (OLDEST - NEVER CLOSE)', digits: 'TBD ❓', opened: '2/28/17', openedDate: new Date('2017-02-28'), fee: '$0', feeNum: 0, business: 'Personal', limit: '$7,600' },
    
    // Jack's cards (newest to oldest)
    { person: 'Jack', name: 'Personal Amex Platinum', digits: 'TBD ❓', opened: '2/5/25', openedDate: new Date('2025-02-05'), fee: '$695', feeNum: 695, business: 'Personal', limit: 'N/A' },
    { person: 'Jack', name: 'Wells Fargo Active Cash (CLOSED)', digits: 'TBD ❓', opened: '11/22', openedDate: new Date('2022-11-01'), fee: '$0', feeNum: 0, business: 'Personal', limit: 'N/A', closed: true },
    { person: 'Jack', name: 'Wells Fargo Reflect', digits: 'TBD ❓', opened: '12/21', openedDate: new Date('2021-12-01'), fee: '$0', feeNum: 0, business: 'Personal', limit: 'N/A' },
    { person: 'Jack', name: 'Chase Sapphire Reserve', digits: 'TBD ❓', opened: '4/20', openedDate: new Date('2020-04-01'), fee: '$550 → $795 (May 2025)', feeNum: 550, business: 'Personal', limit: 'N/A' },
    { person: 'Jack', name: '❗ Delta Skymiles Amex (OLDEST - NEVER CLOSE)', digits: '1004', opened: '9/18', openedDate: new Date('2018-09-01'), fee: '$0', feeNum: 0, business: 'Personal', limit: 'N/A' }
  ]

  const getSortedCardData = () => {
    let sortedData = [...baseCardData]
    
    // First, separate active and closed cards
    const activeCards = sortedData.filter(card => !card.closed)
    const closedCards = sortedData.filter(card => card.closed)
    
    // Sort each group
    const sortGroup = (cards) => {
      if (!sortConfig.key) return cards
      
      return cards.sort((a, b) => {
        let aValue = a[sortConfig.key]
        let bValue = b[sortConfig.key]

        if (sortConfig.key === 'openedDate' || sortConfig.key === 'feeNum') {
          if (sortConfig.direction === 'asc') {
            return aValue > bValue ? 1 : -1
          } else {
            return aValue < bValue ? 1 : -1
          }
        } else {
          if (sortConfig.direction === 'asc') {
            return aValue.localeCompare(bValue)
          } else {
            return bValue.localeCompare(aValue)
          }
        }
      })
    }
    
    // Sort both groups and combine with closed cards at bottom
    return [...sortGroup(activeCards), ...sortGroup(closedCards)]
  }

  const cardData = getSortedCardData()

  // Calculate Jack's 5/24 status with specific cards
  const calculateJack524Cards = () => {
    const twentyFourMonthsAgo = new Date()
    twentyFourMonthsAgo.setMonth(twentyFourMonthsAgo.getMonth() - 24)
    
    // Get Jack's personal cards
    const jacksCards = baseCardData
      .filter(card => card.person === 'Jack' && !card.business && !card.closed)
      .filter(card => card.openedDate > twentyFourMonthsAgo)
      .map(card => `${card.name} (${card.opened})`)
    
    // Add authorized user card - Chase Sapphire Preferred (it counts!)
    const authorizedUserCard = baseCardData.find(card => 
      card.name.includes('Chase Sapphire Preferred') && card.person === 'Marissa'
    )
    if (authorizedUserCard && authorizedUserCard.openedDate > twentyFourMonthsAgo) {
      jacksCards.push(`Chase Sapphire Preferred (AU) (${authorizedUserCard.opened})`)
    }
    
    return jacksCards
  }

  const jack524Cards = calculateJack524Cards()

  // Monthly benefits from Aug 2025 to Aug 2026 (removed Rose Gold, added Personal Gold)
  const monthlyBenefits = {
    'August 2025': [
      { id: 'aug25_amex_gold_personal_dining', card: 'AMEX Gold Personal', benefit: '$10 monthly dining credit (Grubhub, Cheesecake Factory, etc)', person: 'Marissa' },
      { id: 'aug25_amex_gold_personal_uber', card: 'AMEX Gold Personal', benefit: '$10 monthly Uber Cash', person: 'Marissa' },
      { id: 'aug25_amex_gold_statement', card: 'AMEX Business Gold', benefit: '$20 monthly statement credit (FedEx, Grubhub, Office Supply)', person: 'Marissa' },
      { id: 'aug25_amex_gold_walmart', card: 'AMEX Business Gold', benefit: '$12.95 monthly Walmart+ membership credit', person: 'Marissa' },
      { id: 'aug25_amex_plat_wireless', card: 'AMEX Business Platinum', benefit: '$10/month Wireless Credit', person: 'Marissa' },
      { id: 'aug25_csr_doordash', card: 'Chase Sapphire Reserve', benefit: '$5 monthly DoorDash credit', person: 'Jack' },
      { id: 'aug25_csp_monthly', card: 'Chase Sapphire Preferred', benefit: '$10 monthly credit for non-restaurant orders', person: 'Marissa' },
      { id: 'aug25_ihg_anniversary', card: 'IHG Premier', benefit: 'Anniversary Free Night Certificate (40,000 points)', person: 'Marissa' },
      { id: 'aug25_ihg_united', card: 'IHG Premier', benefit: '$50 United TravelBank Cash (anniversary)', person: 'Marissa' },
      { id: 'aug25_ihg_renewal', card: 'IHG Premier', benefit: 'RENEWAL MONTH - Monitor for retention offers', person: 'Marissa' }
    ],
    'September 2025': [
      { id: 'sep25_amex_gold_personal_dining', card: 'AMEX Gold Personal', benefit: '$10 monthly dining credit', person: 'Marissa' },
      { id: 'sep25_amex_gold_personal_uber', card: 'AMEX Gold Personal', benefit: '$10 monthly Uber Cash', person: 'Marissa' },
      { id: 'sep25_amex_gold_statement', card: 'AMEX Business Gold', benefit: '$20 monthly statement credit', person: 'Marissa' },
      { id: 'sep25_amex_gold_walmart', card: 'AMEX Business Gold', benefit: '$12.95 monthly Walmart+ credit', person: 'Marissa' },
      { id: 'sep25_amex_plat_wireless', card: 'AMEX Business Platinum', benefit: '$10/month Wireless Credit', person: 'Marissa' },
      { id: 'sep25_csr_doordash', card: 'Chase Sapphire Reserve', benefit: '$5 monthly DoorDash credit', person: 'Jack' },
      { id: 'sep25_csp_monthly', card: 'Chase Sapphire Preferred', benefit: '$10 monthly credit', person: 'Marissa' },
      { id: 'sep25_ink_scoop_retention', card: 'Chase Ink Business Preferred (Scoop Hero)', benefit: 'Message for October renewal retention offer', person: 'Marissa' }
    ],
    'October 2025': [
      { id: 'oct25_amex_gold_personal_dining', card: 'AMEX Gold Personal', benefit: '$10 monthly dining credit', person: 'Marissa' },
      { id: 'oct25_amex_gold_personal_uber', card: 'AMEX Gold Personal', benefit: '$10 monthly Uber Cash', person: 'Marissa' },
      { id: 'oct25_amex_gold_statement', card: 'AMEX Business Gold', benefit: '$20 monthly statement credit', person: 'Marissa' },
      { id: 'oct25_amex_gold_walmart', card: 'AMEX Business Gold', benefit: '$12.95 monthly Walmart+ credit', person: 'Marissa' },
      { id: 'oct25_amex_plat_wireless', card: 'AMEX Business Platinum', benefit: '$10/month Wireless Credit', person: 'Marissa' },
      { id: 'oct25_csp_monthly', card: 'Chase Sapphire Preferred', benefit: '$10 monthly credit', person: 'Marissa' },
      { id: 'oct25_csr_doordash', card: 'Chase Sapphire Reserve', benefit: '$25 monthly DoorDash credit (NEW: increased from $5)', person: 'Jack' },
      { id: 'oct25_csr_lyft', card: 'Chase Sapphire Reserve', benefit: '$10 monthly Lyft credit (NEW)', person: 'Jack' },
      { id: 'oct25_csr_dining_credit', card: 'Chase Sapphire Reserve', benefit: '$25 biannual dining credit - Sapphire Reserve Exclusive Tables (NEW)', person: 'Jack' },
      { id: 'oct25_csr_edit_hotels', card: 'Chase Sapphire Reserve', benefit: '$41.67 monthly The Edit hotels credit (NEW: $500 annual)', person: 'Jack' },
      { id: 'oct25_csr_stubhub', card: 'Chase Sapphire Reserve', benefit: '$25 biannual StubHub/viagogo credit (NEW)', person: 'Jack' },
      { id: 'oct25_csr_peloton', card: 'Chase Sapphire Reserve', benefit: '$10 monthly Peloton credit (NEW)', person: 'Jack' },
      { id: 'oct25_csr_apple', card: 'Chase Sapphire Reserve', benefit: '$20.83 monthly Apple TV+/Music credit (NEW: $250 annual)', person: 'Jack' },
      { id: 'oct25_ink_scoop_renewal', card: 'Chase Ink Business Preferred (Scoop Hero)', benefit: 'RENEWAL MONTH - Monitor for retention offers', person: 'Marissa' }
    ],
    'November 2025': [
      { id: 'nov25_amex_gold_personal_dining', card: 'AMEX Gold Personal', benefit: '$10 monthly dining credit', person: 'Marissa' },
      { id: 'nov25_amex_gold_personal_uber', card: 'AMEX Gold Personal', benefit: '$10 monthly Uber Cash', person: 'Marissa' },
      { id: 'nov25_amex_gold_statement', card: 'AMEX Business Gold', benefit: '$20 monthly statement credit', person: 'Marissa' },
      { id: 'nov25_amex_gold_walmart', card: 'AMEX Business Gold', benefit: '$12.95 monthly Walmart+ credit', person: 'Marissa' },
      { id: 'nov25_amex_plat_wireless', card: 'AMEX Business Platinum', benefit: '$10/month Wireless Credit', person: 'Marissa' },
      { id: 'nov25_csp_monthly', card: 'Chase Sapphire Preferred', benefit: '$10 monthly credit', person: 'Marissa' },
      { id: 'nov25_csr_doordash', card: 'Chase Sapphire Reserve', benefit: '$25 monthly DoorDash credit', person: 'Jack' },
      { id: 'nov25_csr_lyft', card: 'Chase Sapphire Reserve', benefit: '$10 monthly Lyft credit', person: 'Jack' },
      { id: 'nov25_csr_edit_hotels', card: 'Chase Sapphire Reserve', benefit: '$41.67 monthly hotels credit', person: 'Jack' },
      { id: 'nov25_csr_peloton', card: 'Chase Sapphire Reserve', benefit: '$10 monthly Peloton credit', person: 'Jack' },
      { id: 'nov25_csr_apple', card: 'Chase Sapphire Reserve', benefit: '$20.83 monthly Apple credit', person: 'Jack' },
      { id: 'nov25_amex_plat_retention', card: 'AMEX Business Platinum', benefit: 'Message for December renewal retention offer', person: 'Marissa' }
    ],
    'December 2025': [
      { id: 'dec25_amex_gold_personal_dining', card: 'AMEX Gold Personal', benefit: '$10 monthly dining credit', person: 'Marissa' },
      { id: 'dec25_amex_gold_personal_uber', card: 'AMEX Gold Personal', benefit: '$10 monthly Uber Cash', person: 'Marissa' },
      { id: 'dec25_amex_gold_statement', card: 'AMEX Business Gold', benefit: '$20 monthly statement credit', person: 'Marissa' },
      { id: 'dec25_amex_gold_walmart', card: 'AMEX Business Gold', benefit: '$12.95 monthly Walmart+ credit', person: 'Marissa' },
      { id: 'dec25_amex_plat_wireless', card: 'AMEX Business Platinum', benefit: '$10/month Wireless Credit', person: 'Marissa' },
      { id: 'dec25_csr_doordash', card: 'Chase Sapphire Reserve', benefit: '$25 monthly DoorDash credit', person: 'Jack' },
      { id: 'dec25_csp_monthly', card: 'Chase Sapphire Preferred', benefit: '$10 monthly credit', person: 'Marissa' },
      { id: 'dec25_csr_lyft', card: 'Chase Sapphire Reserve', benefit: '$10 monthly Lyft credit', person: 'Jack' },
      { id: 'dec25_csr_edit_hotels', card: 'Chase Sapphire Reserve', benefit: '$41.67 monthly hotels credit', person: 'Jack' },
      { id: 'dec25_csr_peloton', card: 'Chase Sapphire Reserve', benefit: '$10 monthly Peloton credit', person: 'Jack' },
      { id: 'dec25_csr_apple', card: 'Chase Sapphire Reserve', benefit: '$20.83 monthly Apple credit', person: 'Jack' },
      { id: 'dec25_amex_plat_renewal', card: 'AMEX Business Platinum', benefit: 'RENEWAL MONTH - Monitor for retention offers', person: 'Marissa' },
      { id: 'dec25_ink_pdl_retention', card: 'Chase Ink Business Preferred (PDL)', benefit: 'Message for January renewal retention offer', person: 'Marissa' }
    ],
    'January 2026': [
      { id: 'jan26_amex_gold_personal_dining', card: 'AMEX Gold Personal', benefit: '$10 monthly dining credit', person: 'Marissa' },
      { id: 'jan26_amex_gold_personal_uber', card: 'AMEX Gold Personal', benefit: '$10 monthly Uber Cash', person: 'Marissa' },
      { id: 'jan26_amex_gold_personal_annual', card: 'AMEX Gold Personal', benefit: '$120 annual dining credit (reset)', person: 'Marissa' },
      { id: 'jan26_amex_gold_personal_uber_annual', card: 'AMEX Gold Personal', benefit: '$120 annual Uber credit (reset)', person: 'Marissa' },
      { id: 'jan26_amex_gold_statement', card: 'AMEX Business Gold', benefit: '$20 monthly statement credit', person: 'Marissa' },
      { id: 'jan26_amex_gold_walmart', card: 'AMEX Business Gold', benefit: '$12.95 monthly Walmart+ credit', person: 'Marissa' },
      { id: 'jan26_amex_plat_wireless', card: 'AMEX Business Platinum', benefit: '$10/month Wireless Credit', person: 'Marissa' },
      { id: 'jan26_csr_doordash', card: 'Chase Sapphire Reserve', benefit: '$25 monthly DoorDash credit', person: 'Jack' },
      { id: 'jan26_csp_monthly', card: 'Chase Sapphire Preferred', benefit: '$10 monthly credit', person: 'Marissa' },
      { id: 'jan26_csr_lyft', card: 'Chase Sapphire Reserve', benefit: '$10 monthly Lyft credit', person: 'Jack' },
      { id: 'jan26_csr_edit_hotels', card: 'Chase Sapphire Reserve', benefit: '$41.67 monthly hotels credit', person: 'Jack' },
      { id: 'jan26_csr_peloton', card: 'Chase Sapphire Reserve', benefit: '$10 monthly Peloton credit', person: 'Jack' },
      { id: 'jan26_csr_apple', card: 'Chase Sapphire Reserve', benefit: '$20.83 monthly Apple credit', person: 'Jack' },
      { id: 'jan26_ink_pdl_renewal', card: 'Chase Ink Business Preferred (PDL)', benefit: 'RENEWAL MONTH - Monitor for retention offers', person: 'Marissa' },
      { id: 'jan26_amex_gold_retention', card: 'AMEX Business Gold', benefit: 'Message for February renewal retention offer', person: 'Marissa' }
    ],
    'February 2026': [
      { id: 'feb26_amex_gold_personal_dining', card: 'AMEX Gold Personal', benefit: '$10 monthly dining credit', person: 'Marissa' },
      { id: 'feb26_amex_gold_personal_uber', card: 'AMEX Gold Personal', benefit: '$10 monthly Uber Cash', person: 'Marissa' },
      { id: 'feb26_amex_gold_statement', card: 'AMEX Business Gold', benefit: '$20 monthly statement credit', person: 'Marissa' },
      { id: 'feb26_amex_gold_walmart', card: 'AMEX Business Gold', benefit: '$12.95 monthly Walmart+ credit', person: 'Marissa' },
      { id: 'feb26_amex_plat_wireless', card: 'AMEX Business Platinum', benefit: '$10/month Wireless Credit', person: 'Marissa' },
      { id: 'feb26_csr_doordash', card: 'Chase Sapphire Reserve', benefit: '$25 monthly DoorDash credit', person: 'Jack' },
      { id: 'feb26_csp_monthly', card: 'Chase Sapphire Preferred', benefit: '$10 monthly credit', person: 'Marissa' },
      { id: 'feb26_csr_lyft', card: 'Chase Sapphire Reserve', benefit: '$10 monthly Lyft credit', person: 'Jack' },
      { id: 'feb26_csr_edit_hotels', card: 'Chase Sapphire Reserve', benefit: '$41.67 monthly hotels credit', person: 'Jack' },
      { id: 'feb26_csr_peloton', card: 'Chase Sapphire Reserve', benefit: '$10 monthly Peloton credit', person: 'Jack' },
      { id: 'feb26_csr_apple', card: 'Chase Sapphire Reserve', benefit: '$20.83 monthly Apple credit', person: 'Jack' },
      { id: 'feb26_amex_gold_renewal', card: 'AMEX Business Gold', benefit: 'RENEWAL MONTH - Monitor for retention offers', person: 'Marissa' },
      { id: 'feb26_ink_pdl2_renewal', card: 'Chase Ink Business Preferred (PDL)', benefit: 'RENEWAL MONTH - Monitor for retention offers', person: 'Marissa' },
      { id: 'feb26_quicksilver_renewal', card: 'Capital One QuicksilverOne', benefit: 'RENEWAL MONTH - RECOMMEND CANCEL', person: 'Marissa' },
      { id: 'feb26_jack_plat_retention', card: 'Personal Amex Platinum', benefit: 'Message for March renewal retention offer', person: 'Jack' }
    ],
    'March 2026': [
      { id: 'mar26_amex_gold_personal_dining', card: 'AMEX Gold Personal', benefit: '$10 monthly dining credit', person: 'Marissa' },
      { id: 'mar26_amex_gold_personal_uber', card: 'AMEX Gold Personal', benefit: '$10 monthly Uber Cash', person: 'Marissa' },
      { id: 'mar26_amex_gold_statement', card: 'AMEX Business Gold', benefit: '$20 monthly statement credit', person: 'Marissa' },
      { id: 'mar26_amex_gold_walmart', card: 'AMEX Business Gold', benefit: '$12.95 monthly Walmart+ credit', person: 'Marissa' },
      { id: 'mar26_amex_plat_wireless', card: 'AMEX Business Platinum', benefit: '$10/month Wireless Credit', person: 'Marissa' },
      { id: 'mar26_csr_doordash', card: 'Chase Sapphire Reserve', benefit: '$25 monthly DoorDash credit', person: 'Jack' },
      { id: 'mar26_csp_monthly', card: 'Chase Sapphire Preferred', benefit: '$10 monthly credit', person: 'Marissa' },
      { id: 'mar26_csr_lyft', card: 'Chase Sapphire Reserve', benefit: '$10 monthly Lyft credit', person: 'Jack' },
      { id: 'mar26_csr_edit_hotels', card: 'Chase Sapphire Reserve', benefit: '$41.67 monthly hotels credit', person: 'Jack' },
      { id: 'mar26_csr_peloton', card: 'Chase Sapphire Reserve', benefit: '$10 monthly Peloton credit', person: 'Jack' },
      { id: 'mar26_csr_apple', card: 'Chase Sapphire Reserve', benefit: '$20.83 monthly Apple credit', person: 'Jack' },
      { id: 'mar26_jack_plat_renewal', card: 'Personal Amex Platinum', benefit: 'RENEWAL MONTH - Monitor for retention offers', person: 'Jack' },
      { id: 'mar26_csp_renewal', card: 'Chase Sapphire Preferred', benefit: 'RENEWAL MONTH - Monitor for retention offers', person: 'Marissa' },
      { id: 'mar26_ink_pdl3_retention', card: 'Chase Ink Business Preferred (PDL)', benefit: 'Message for April renewal retention offer', person: 'Marissa' }
    ],
    'April 2026': [
      { id: 'apr26_amex_gold_personal_dining', card: 'AMEX Gold Personal', benefit: '$10 monthly dining credit', person: 'Marissa' },
      { id: 'apr26_amex_gold_personal_uber', card: 'AMEX Gold Personal', benefit: '$10 monthly Uber Cash', person: 'Marissa' },
      { id: 'apr26_amex_gold_statement', card: 'AMEX Business Gold', benefit: '$20 monthly statement credit', person: 'Marissa' },
      { id: 'apr26_amex_gold_walmart', card: 'AMEX Business Gold', benefit: '$12.95 monthly Walmart+ credit', person: 'Marissa' },
      { id: 'apr26_amex_plat_wireless', card: 'AMEX Business Platinum', benefit: '$10/month Wireless Credit', person: 'Marissa' },
      { id: 'apr26_csr_doordash', card: 'Chase Sapphire Reserve', benefit: '$25 monthly DoorDash credit', person: 'Jack' },
      { id: 'apr26_csp_monthly', card: 'Chase Sapphire Preferred', benefit: '$10 monthly credit', person: 'Marissa' },
      { id: 'apr26_csr_lyft', card: 'Chase Sapphire Reserve', benefit: '$10 monthly Lyft credit', person: 'Jack' },
      { id: 'apr26_csr_edit_hotels', card: 'Chase Sapphire Reserve', benefit: '$41.67 monthly hotels credit', person: 'Jack' },
      { id: 'apr26_csr_stubhub2', card: 'Chase Sapphire Reserve', benefit: '$25 biannual StubHub/viagogo credit', person: 'Jack' },
      { id: 'apr26_csr_dining_credit2', card: 'Chase Sapphire Reserve', benefit: '$25 biannual dining credit', person: 'Jack' },
      { id: 'apr26_csr_peloton', card: 'Chase Sapphire Reserve', benefit: '$10 monthly Peloton credit', person: 'Jack' },
      { id: 'apr26_csr_apple', card: 'Chase Sapphire Reserve', benefit: '$20.83 monthly Apple credit', person: 'Jack' },
      { id: 'apr26_ink_pdl3_renewal', card: 'Chase Ink Business Preferred (PDL)', benefit: 'RENEWAL MONTH - Monitor for retention offers', person: 'Marissa' },
      { id: 'apr26_csr_retention', card: 'Chase Sapphire Reserve', benefit: 'Message for May renewal retention offer', person: 'Jack' }
    ],
    'May 2026': [
      { id: 'may26_amex_gold_personal_dining', card: 'AMEX Gold Personal', benefit: '$10 monthly dining credit', person: 'Marissa' },
      { id: 'may26_amex_gold_personal_uber', card: 'AMEX Gold Personal', benefit: '$10 monthly Uber Cash', person: 'Marissa' },
      { id: 'may26_amex_gold_statement', card: 'AMEX Business Gold', benefit: '$20 monthly statement credit', person: 'Marissa' },
      { id: 'may26_amex_gold_walmart', card: 'AMEX Business Gold', benefit: '$12.95 monthly Walmart+ credit', person: 'Marissa' },
      { id: 'may26_amex_plat_wireless', card: 'AMEX Business Platinum', benefit: '$10/month Wireless Credit', person: 'Marissa' },
      { id: 'may26_csr_doordash', card: 'Chase Sapphire Reserve', benefit: '$25 monthly DoorDash credit', person: 'Jack' },
      { id: 'may26_csp_monthly', card: 'Chase Sapphire Preferred', benefit: '$10 monthly credit', person: 'Marissa' },
      { id: 'may26_csr_lyft', card: 'Chase Sapphire Reserve', benefit: '$10 monthly Lyft credit', person: 'Jack' },
      { id: 'may26_csr_edit_hotels', card: 'Chase Sapphire Reserve', benefit: '$41.67 monthly hotels credit', person: 'Jack' },
      { id: 'may26_csr_peloton', card: 'Chase Sapphire Reserve', benefit: '$10 monthly Peloton credit', person: 'Jack' },
      { id: 'may26_csr_apple', card: 'Chase Sapphire Reserve', benefit: '$20.83 monthly Apple credit', person: 'Jack' },
      { id: 'may26_csr_renewal', card: 'Chase Sapphire Reserve', benefit: 'RENEWAL MONTH - $795 FEE - CRITICAL', person: 'Jack' }
    ],
    'June 2026': [
      { id: 'jun26_amex_gold_personal_dining', card: 'AMEX Gold Personal', benefit: '$10 monthly dining credit', person: 'Marissa' },
      { id: 'jun26_amex_gold_personal_uber', card: 'AMEX Gold Personal', benefit: '$10 monthly Uber Cash', person: 'Marissa' },
      { id: 'jun26_amex_gold_statement', card: 'AMEX Business Gold', benefit: '$20 monthly statement credit', person: 'Marissa' },
      { id: 'jun26_amex_gold_walmart', card: 'AMEX Business Gold', benefit: '$12.95 monthly Walmart+ credit', person: 'Marissa' },
      { id: 'jun26_amex_plat_wireless', card: 'AMEX Business Platinum', benefit: '$10/month Wireless Credit', person: 'Marissa' },
      { id: 'jun26_csr_doordash', card: 'Chase Sapphire Reserve', benefit: '$25 monthly DoorDash credit', person: 'Jack' },
      { id: 'jun26_csp_monthly', card: 'Chase Sapphire Preferred', benefit: '$10 monthly credit', person: 'Marissa' },
      { id: 'jun26_csr_lyft', card: 'Chase Sapphire Reserve', benefit: '$10 monthly Lyft credit', person: 'Jack' },
      { id: 'jun26_csr_edit_hotels', card: 'Chase Sapphire Reserve', benefit: '$41.67 monthly hotels credit', person: 'Jack' },
      { id: 'jun26_csr_peloton', card: 'Chase Sapphire Reserve', benefit: '$10 monthly Peloton credit', person: 'Jack' },
      { id: 'jun26_csr_apple', card: 'Chase Sapphire Reserve', benefit: '$20.83 monthly Apple credit', person: 'Jack' }
    ],
    'July 2026': [
      { id: 'jul26_amex_gold_personal_dining', card: 'AMEX Gold Personal', benefit: '$10 monthly dining credit', person: 'Marissa' },
      { id: 'jul26_amex_gold_personal_uber', card: 'AMEX Gold Personal', benefit: '$10 monthly Uber Cash', person: 'Marissa' },
      { id: 'jul26_amex_gold_personal_renewal', card: 'AMEX Gold Personal', benefit: 'RENEWAL MONTH - Monitor for retention offers', person: 'Marissa' },
      { id: 'jul26_amex_gold_statement', card: 'AMEX Business Gold', benefit: '$20 monthly statement credit', person: 'Marissa' },
      { id: 'jul26_amex_gold_walmart', card: 'AMEX Business Gold', benefit: '$12.95 monthly Walmart+ credit', person: 'Marissa' },
      { id: 'jul26_amex_plat_wireless', card: 'AMEX Business Platinum', benefit: '$10/month Wireless Credit', person: 'Marissa' },
      { id: 'jul26_amex_plat_dell', card: 'AMEX Business Platinum', benefit: '$150 Dell Technologies Statement Credits (annual reset)', person: 'Marissa' },
      { id: 'jul26_amex_plat_adobe', card: 'AMEX Business Platinum', benefit: '$250 Adobe Credit after $600 spend (annual reset)', person: 'Marissa' },
      { id: 'jul26_csr_doordash', card: 'Chase Sapphire Reserve', benefit: '$25 monthly DoorDash credit', person: 'Jack' },
      { id: 'jul26_csp_monthly', card: 'Chase Sapphire Preferred', benefit: '$10 monthly credit', person: 'Marissa' },
      { id: 'jul26_csr_lyft', card: 'Chase Sapphire Reserve', benefit: '$10 monthly Lyft credit', person: 'Jack' },
      { id: 'jul26_csr_edit_hotels', card: 'Chase Sapphire Reserve', benefit: '$41.67 monthly hotels credit', person: 'Jack' },
      { id: 'jul26_csr_peloton', card: 'Chase Sapphire Reserve', benefit: '$10 monthly Peloton credit', person: 'Jack' },
      { id: 'jul26_csr_apple', card: 'Chase Sapphire Reserve', benefit: '$20.83 monthly Apple credit', person: 'Jack' },
      { id: 'jul26_ihg_retention', card: 'IHG Premier', benefit: 'Message for August 2026 renewal retention offer', person: 'Marissa' }
    ],
    'August 2026': [
      { id: 'aug26_amex_gold_personal_dining', card: 'AMEX Gold Personal', benefit: '$10 monthly dining credit', person: 'Marissa' },
      { id: 'aug26_amex_gold_personal_uber', card: 'AMEX Gold Personal', benefit: '$10 monthly Uber Cash', person: 'Marissa' },
      { id: 'aug26_amex_gold_statement', card: 'AMEX Business Gold', benefit: '$20 monthly statement credit', person: 'Marissa' },
      { id: 'aug26_amex_gold_walmart', card: 'AMEX Business Gold', benefit: '$12.95 monthly Walmart+ credit', person: 'Marissa' },
      { id: 'aug26_amex_plat_wireless', card: 'AMEX Business Platinum', benefit: '$10/month Wireless Credit', person: 'Marissa' },
      { id: 'aug26_csr_doordash', card: 'Chase Sapphire Reserve', benefit: '$25 monthly DoorDash credit', person: 'Jack' },
      { id: 'aug26_csp_monthly', card: 'Chase Sapphire Preferred', benefit: '$10 monthly credit', person: 'Marissa' },
      { id: 'aug26_csr_lyft', card: 'Chase Sapphire Reserve', benefit: '$10 monthly Lyft credit', person: 'Jack' },
      { id: 'aug26_csr_edit_hotels', card: 'Chase Sapphire Reserve', benefit: '$41.67 monthly hotels credit', person: 'Jack' },
      { id: 'aug26_csr_peloton', card: 'Chase Sapphire Reserve', benefit: '$10 monthly Peloton credit', person: 'Jack' },
      { id: 'aug26_csr_apple', card: 'Chase Sapphire Reserve', benefit: '$20.83 monthly Apple credit', person: 'Jack' },
      { id: 'aug26_ihg_anniversary', card: 'IHG Premier', benefit: 'Anniversary Free Night Certificate (40,000 points)', person: 'Marissa' },
      { id: 'aug26_ihg_united', card: 'IHG Premier', benefit: '$50 United TravelBank Cash (anniversary)', person: 'Marissa' },
      { id: 'aug26_ihg_renewal', card: 'IHG Premier', benefit: 'RENEWAL MONTH - Monitor for retention offers', person: 'Marissa' }
    ]
  }

  // Card renewal schedule with SMS reminders
  const upcomingRenewals = [
    { card: 'IHG Premier', person: 'Marissa', renewalDate: new Date('2025-08-03'), fee: 99, opened: '8/3/24', recommendation: 'KEEP - Free night worth more than fee' },
    { card: 'Chase Ink (Scoop)', person: 'Marissa', renewalDate: new Date('2025-10-04'), fee: 95, opened: '9/4/24', recommendation: 'EVALUATE - Consider consolidating Ink cards' },
    { card: 'AMEX Business Platinum', person: 'Marissa', renewalDate: new Date('2025-12-18'), fee: 695, opened: '12/18/23', recommendation: 'KEEP - Premium benefits, check retention offers' },
    { card: 'Chase Ink (PDL)', person: 'Marissa', renewalDate: new Date('2026-01-19'), fee: 95, opened: '12/19/23', recommendation: 'EVALUATE - Multiple Ink cards' },
    { card: 'AMEX Business Gold', person: 'Marissa', renewalDate: new Date('2026-01-31'), fee: 375, opened: '1/31/24', recommendation: 'KEEP - 4X categories valuable' },
    { card: 'Chase Ink (PDL)', person: 'Marissa', renewalDate: new Date('2026-02-05'), fee: 95, opened: '2/5/25', recommendation: 'EVALUATE - Consider consolidating' },
    { card: 'Capital One QuicksilverOne', person: 'Marissa', renewalDate: new Date('2026-02-27'), fee: 39, opened: '1/27/19', recommendation: 'CANCEL - Poor value for fee' },
    { card: 'Personal Amex Platinum', person: 'Jack', renewalDate: new Date('2026-03-05'), fee: 695, opened: '2/5/25', recommendation: 'KEEP - Lounge access valuable' },
    { card: 'Chase Sapphire Preferred', person: 'Marissa', renewalDate: new Date('2026-03-04'), fee: 95, opened: '3/4/24', recommendation: 'KEEP - Transfer partner hub' },
    { card: 'Chase Ink (Scoop)', person: 'Marissa', renewalDate: new Date('2026-04-04'), fee: 95, opened: '4/4/24', recommendation: 'EVALUATE' },
    { card: 'Chase Sapphire Reserve', person: 'Jack', renewalDate: new Date('2026-05-01'), fee: 795, opened: '4/20', recommendation: 'CRITICAL - Negotiate retention or downgrade' },
    { card: 'AMEX Gold Personal', person: 'Marissa', renewalDate: new Date('2026-07-19'), fee: 325, opened: '7/19/25', recommendation: 'KEEP - Great dining/grocery rewards' }
  ]

  // Spending categories with recommendations
  const spendingCategories = {
    'Dining': { 
      recommended: 'AMEX Gold Personal (Marissa)', 
      rate: '4X Points',
      details: 'Use for all restaurant purchases, takeout, and delivery services'
    },
    'Groceries': { 
      recommended: 'AMEX Gold Personal (Marissa)', 
      rate: '4X Points (US Supermarkets)',
      details: 'Up to $25,000/year, then 1X'
    },
    'Travel': { 
      recommended: 'Chase Sapphire Reserve (Jack)', 
      rate: '3X Points',
      details: 'Hotels, flights, car rentals, cruises, trains, taxis, parking, tolls'
    },
    'Gas': { 
      recommended: 'IHG Premier or Discover IT', 
      rate: '2X Points or 5% (rotating)',
      details: 'IHG gives 2X year-round, Discover 5% during bonus quarters'
    },
    'Online Advertising': { 
      recommended: 'Chase Ink Business Preferred', 
      rate: '3X Points',
      details: 'Facebook ads, Google ads, social media advertising'
    },
    'Phone/Internet/Cable': { 
      recommended: 'Chase Ink Business Preferred', 
      rate: '3X Points',
      details: 'Cell phone plans, internet service, cable/streaming services'
    },
    'Office Supplies': { 
      recommended: 'Chase Ink Business Preferred', 
      rate: '3X Points',
      details: 'Staples, Office Depot, online office supply stores'
    },
    'Shipping': { 
      recommended: 'Chase Ink Business Preferred', 
      rate: '3X Points',
      details: 'FedEx, UPS, USPS, shipping services'
    },
    'Everything Else': { 
      recommended: 'Capital One QuicksilverOne or Wells Fargo Active Cash', 
      rate: '1.5% or 2% Cash Back',
      details: 'Non-category spending'
    }
  }

  // Transfer partners data
  const transferPartners = {
    'Chase Ultimate Rewards': [
      { partner: 'Hyatt', ratio: '1:1', notes: 'Best value for luxury hotels' },
      { partner: 'United Airlines', ratio: '1:1', notes: 'Good for domestic and international flights' },
      { partner: 'Southwest', ratio: '1:1', notes: 'Great for domestic flights' },
      { partner: 'British Airways', ratio: '1:1', notes: 'Good for short-haul flights' },
      { partner: 'Virgin Atlantic', ratio: '1:1', notes: 'Good for partner awards' },
      { partner: 'Air France/KLM', ratio: '1:1', notes: 'Europe flights' },
      { partner: 'Singapore Airlines', ratio: '1:1', notes: 'Best business class' },
      { partner: 'Aeroplan', ratio: '1:1', notes: 'Star Alliance partner' },
      { partner: 'JetBlue', ratio: '1:1', notes: 'Northeast US flights' },
      { partner: 'Iberia', ratio: '1:1', notes: 'Spain and Europe' },
      { partner: 'Emirates', ratio: '1:1', notes: 'Middle East luxury' },
      { partner: 'Marriott Bonvoy', ratio: '1:1', notes: 'Hotel stays' },
      { partner: 'IHG', ratio: '1:1', notes: 'Wide hotel selection' }
    ],
    'Amex Membership Rewards': [
      { partner: 'Delta', ratio: '1:1', notes: 'No fuel surcharges' },
      { partner: 'JetBlue', ratio: '1:0.8', notes: 'Northeast routes' },
      { partner: 'Hawaiian Airlines', ratio: '1:1', notes: 'Hawaii flights' },
      { partner: 'British Airways', ratio: '1:1', notes: 'OneWorld alliance' },
      { partner: 'Air France/KLM', ratio: '1:1', notes: 'SkyTeam alliance' },
      { partner: 'Emirates', ratio: '1:1', notes: 'Luxury travel' },
      { partner: 'Etihad', ratio: '1:1', notes: 'Middle East carrier' },
      { partner: 'Virgin Atlantic', ratio: '1:1', notes: 'Transatlantic' },
      { partner: 'ANA', ratio: '1:1', notes: 'Star Alliance, Japan' },
      { partner: 'Singapore Airlines', ratio: '1:1', notes: 'Premium cabins' },
      { partner: 'Qantas', ratio: '1:1', notes: 'Australia routes' },
      { partner: 'Hilton Honors', ratio: '1:2', notes: '2X value for hotels' },
      { partner: 'Marriott Bonvoy', ratio: '1:1', notes: 'Hotel redemptions' }
    ]
  }

  // Lounge data
  const loungeData = {
    'Centurion Lounges': [
      { location: 'Miami (MIA)', terminal: 'Terminal D', access: 'AMEX Platinum', features: 'Full bar, hot meals, spa services' },
      { location: 'Dallas (DFW)', terminal: 'Terminal D', access: 'AMEX Platinum', features: 'Largest Centurion lounge' },
      { location: 'Las Vegas (LAS)', terminal: 'Terminal D', access: 'AMEX Platinum', features: 'Views of the strip' }
    ],
    'Priority Pass (Florida)': [
      { location: 'Tampa (TPA)', terminal: 'Terminal A', access: 'Chase Sapphire cards', details: ['United Club', 'Chase Sapphire Lounge (Coming 2025)'] },
      { location: 'Orlando (MCO)', terminal: 'Terminal B', access: 'Chase Sapphire cards', details: ['The Club MCO', 'XpresSpa'] },
      { location: 'Fort Lauderdale (FLL)', terminal: 'Multiple', access: 'Chase Sapphire cards', details: ['Club FLL (Terminal 2)', 'United Club (Terminal 1)'] },
      { location: 'Miami (MIA)', terminal: 'Multiple', access: 'Chase Sapphire cards', details: ['Turkish Airlines Lounge', 'Avianca Lounge'] }
    ],
    'Delta Sky Clubs': [
      { location: 'Atlanta (ATL)', terminal: 'Multiple', access: 'AMEX Platinum when flying Delta', notes: 'Multiple locations' },
      { location: 'Tampa (TPA)', terminal: 'Terminal A', access: 'AMEX Platinum when flying Delta', notes: 'Renovated 2024' }
    ]
  }

  // New handlers for loyalty numbers
  const addLoyaltyNumber = (category) => {
    const newNumber = {
      id: Date.now(),
      name: '',
      number: '',
      category: category === 'knownTraveler' ? 'Known Traveler' : '',
      points: ''
    }
    
    setLoyaltyNumbers(prev => ({
      ...prev,
      [category]: [...prev[category], newNumber]
    }))
  }

  const updateLoyaltyNumber = (category, id, field, value) => {
    setLoyaltyNumbers(prev => ({
      ...prev,
      [category]: prev[category].map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }))
  }

  const deleteLoyaltyNumber = (category, id) => {
    setLoyaltyNumbers(prev => ({
      ...prev,
      [category]: prev[category].filter(item => item.id !== id)
    }))
  }

  // Filter loyalty numbers based on search
  const getFilteredLoyaltyNumbers = (category) => {
    if (!loyaltySearch) return loyaltyNumbers[category]
    
    return loyaltyNumbers[category].filter(item => 
      item.name?.toLowerCase().includes(loyaltySearch.toLowerCase()) ||
      item.number?.toLowerCase().includes(loyaltySearch.toLowerCase()) ||
      item.category?.toLowerCase().includes(loyaltySearch.toLowerCase())
    )
  }

  // Group airlines by subcategory
  const getGroupedAirlines = () => {
    const filtered = getFilteredLoyaltyNumbers('airlines')
    const grouped = {}
    
    filtered.forEach(airline => {
      const key = airline.subcategory || 'Other'
      if (!grouped[key]) grouped[key] = []
      grouped[key].push(airline)
    })
    
    // Sort within each group by name
    Object.keys(grouped).forEach(key => {
      grouped[key].sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    })
    
    return grouped
  }

  // Referral link handlers
  const addReferralLink = () => {
    setReferralLinks(prev => [...prev, {
      id: Date.now(),
      card: '',
      link: '',
      bonus: '',
      expiry: ''
    }])
  }

  const updateReferralLink = (id, field, value) => {
    setReferralLinks(prev => prev.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    ))
  }

  const deleteReferralLink = (id) => {
    setReferralLinks(prev => prev.filter(link => link.id !== id))
  }

  // Export to CSV function
  const exportToCSV = () => {
    // Prepare card data
    const cardHeaders = ['Person', 'Card Name', 'Last 4', 'Opened', 'Annual Fee', 'Business', 'Credit Limit', 'Status', 'Date Closed']
    const cardRows = cardData.map(card => [
      card.person,
      card.name,
      card.digits,
      card.opened,
      card.fee,
      card.business,
      card.limit,
      card.closed ? 'Closed' : 'Active',
      card.closedDate || ''
    ])

    // Prepare points data
    const pointsHeaders = ['Program', 'Balance', 'Estimated Value']
    const pointsRows = Object.entries(pointsBalances).map(([program, balance]) => [
      program,
      balance,
      `$${(balance * 0.02).toFixed(0)}`
    ])

    // Create CSV content
    let csvContent = 'Credit Cards\n'
    csvContent += cardHeaders.join(',') + '\n'
    csvContent += cardRows.map(row => row.join(',')).join('\n')
    
    csvContent += '\n\nPoints & Miles\n'
    csvContent += pointsHeaders.join(',') + '\n'
    csvContent += pointsRows.map(row => row.join(',')).join('\n')

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `credit-cards-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  // SMS notification setup instructions
  const renderSMSInstructions = () => (
    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg mb-4">
      <div className="flex items-start">
        <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <h4 className="font-semibold text-yellow-800">SMS Notifications Setup</h4>
          <p className="text-sm text-yellow-700 mt-1">
            To set up SMS reminders securely, you'll need a backend service. Never put API keys in frontend code!
          </p>
          <div className="mt-3 text-sm">
            <p className="font-semibold">Option 1: Use a service like Zapier</p>
            <ul className="list-disc pl-5 mt-1 text-yellow-700">
              <li>Connect Google Calendar to Twilio via Zapier</li>
              <li>Create calendar events 10 days before renewals</li>
              <li>Zapier will automatically send SMS</li>
            </ul>
            <p className="font-semibold mt-3">Option 2: Simple Node.js backend</p>
            <p className="text-yellow-700 mt-1">I can help you create a secure backend service for Digital Ocean.</p>
          </div>
        </div>
      </div>
    </div>
  )

  // Render functions for each tab
  const renderOverview = () => (
    <div className="p-5 bg-gray-50">
      <h2 className="text-2xl font-bold mb-5 text-center text-blue-800">
        📊 Complete Card Portfolio
      </h2>
      
      {/* Google Sheets Integration */}
      <div className="mb-4 text-center">
        <button
          onClick={fetchSheetData}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center gap-2"
          disabled={loadingSheet}
        >
          <Download className="w-4 h-4" />
          {loadingSheet ? 'Loading...' : 'Sync with Google Sheets'}
        </button>
        {sheetData && (
          <p className="text-sm text-green-600 mt-2">✓ Sheet data loaded</p>
        )}
      </div>
      
      {/* Annual Fees Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-blue-100 p-5 rounded-xl text-center">
          <h3 className="text-lg text-blue-700 mb-2">Marissa's Annual Fees</h3>
          <p className="text-3xl font-bold text-blue-900">
            ${baseCardData.filter(c => c.person === 'Marissa' && !c.closed).reduce((sum, c) => sum + c.feeNum, 0).toLocaleString()}
          </p>
          <p className="text-sm text-blue-700">
            ${(baseCardData.filter(c => c.person === 'Marissa' && !c.closed).reduce((sum, c) => sum + c.feeNum, 0) / 12).toFixed(0)}/month
          </p>
        </div>
        <div className="bg-purple-100 p-5 rounded-xl text-center">
          <h3 className="text-lg text-purple-700 mb-2">Jack's Annual Fees</h3>
          <p className="text-3xl font-bold text-purple-900">
            ${baseCardData.filter(c => c.person === 'Jack' && !c.closed).reduce((sum, c) => sum + (c.fee.includes('795') ? 795 : c.feeNum), 0).toLocaleString()}
          </p>
          <p className="text-sm text-purple-700">
            ${(baseCardData.filter(c => c.person === 'Jack' && !c.closed).reduce((sum, c) => sum + (c.fee.includes('795') ? 795 : c.feeNum), 0) / 12).toFixed(0)}/month
          </p>
        </div>
      </div>

      <div className="bg-indigo-600 p-5 rounded-xl text-center mb-8 text-white">
        <h3 className="text-lg mb-2">Combined Total</h3>
        <p className="text-4xl font-bold">
          ${(baseCardData.filter(c => !c.closed).reduce((sum, c) => sum + (c.fee.includes('795') ? 795 : c.feeNum), 0)).toLocaleString()}
        </p>
        <p className="text-base opacity-90">
          ${(baseCardData.filter(c => !c.closed).reduce((sum, c) => sum + (c.fee.includes('795') ? 795 : c.feeNum), 0) / 12).toFixed(0)}/month
        </p>
      </div>

      {/* 5/24 Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-green-100 p-5 rounded-xl">
          <h3 className="text-lg text-green-700 mb-2 text-center">Marissa's 5/24 Status</h3>
          <p className="text-4xl font-bold text-green-800 text-center">3/24</p>
          <p className="text-xs text-green-600 text-center mb-3">Room for 2 more Chase cards</p>
          <div className="text-xs">
            <p className="font-semibold text-green-700">Cards counting:</p>
            <ul className="mt-1 text-green-600">
              <li>• AMEX Gold Personal (7/19/25)</li>
              <li>• IHG Premier (8/3/24)</li>
              <li>• Chase Sapphire Preferred (3/4/24)</li>
            </ul>
          </div>
        </div>
        <div className="bg-green-100 p-5 rounded-xl">
          <h3 className="text-lg text-green-700 mb-2 text-center">Jack's 5/24 Status</h3>
          <p className="text-4xl font-bold text-green-800 text-center">2/24</p>
          <p className="text-xs text-green-600 text-center mb-3">Well under the limit</p>
          <div className="text-xs">
            <p className="font-semibold text-green-700">Cards counting:</p>
            <ul className="mt-1 text-green-600">
              <li>• Personal Amex Platinum (2/5/25)</li>
              <li>• Chase Sapphire Preferred (AU) (3/4/24)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Card Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-lg">
          <thead>
            <tr className="bg-blue-800 text-white">
              <th className="p-3 text-left text-xs cursor-pointer hover:bg-blue-700" onClick={() => handleSort('person')}>
                Person {sortConfig.key === 'person' && (
                  sortConfig.direction === 'asc' ? <ChevronUp className="inline w-3 h-3" /> : <ChevronDown className="inline w-3 h-3" />
                )}
              </th>
              <th className="p-3 text-left text-xs cursor-pointer hover:bg-blue-700" onClick={() => handleSort('name')}>
                Card {sortConfig.key === 'name' && (
                  sortConfig.direction === 'asc' ? <ChevronUp className="inline w-3 h-3" /> : <ChevronDown className="inline w-3 h-3" />
                )}
              </th>
              <th className="p-3 text-left text-xs">Last 4</th>
              <th className="p-3 text-left text-xs cursor-pointer hover:bg-blue-700" onClick={() => handleSort('openedDate')}>
                Opened {sortConfig.key === 'openedDate' && (
                  sortConfig.direction === 'asc' ? <ChevronUp className="inline w-3 h-3" /> : <ChevronDown className="inline w-3 h-3" />
                )}
              </th>
              <th className="p-3 text-left text-xs cursor-pointer hover:bg-blue-700" onClick={() => handleSort('feeNum')}>
                Annual Fee {sortConfig.key === 'feeNum' && (
                  sortConfig.direction === 'asc' ? <ChevronUp className="inline w-3 h-3" /> : <ChevronDown className="inline w-3 h-3" />
                )}
              </th>
              <th className="p-3 text-left text-xs">Business</th>
              <th className="p-3 text-left text-xs">Credit Limit</th>
              <th className="p-3 text-left text-xs">Lounge Access</th>
              <th className="p-3 text-left text-xs">Date Closed</th>
            </tr>
          </thead>
          <tbody>
            {cardData.map((card, index) => (
              <tr key={index} className={`border-b hover:bg-gray-50 ${card.closed ? 'opacity-60' : ''}`}>
                <td className="p-2 text-xs">{card.person}</td>
                <td className={`p-2 text-xs ${card.name.includes('❗') ? 'font-bold' : ''} ${card.closed ? 'line-through' : ''}`}>
                  {card.name}
                </td>
                <td className="p-2 text-xs">{card.digits}</td>
                <td className="p-2 text-xs">{card.opened}</td>
                <td className="p-2 text-xs">{card.fee}</td>
                <td className="p-2 text-xs">{card.business}</td>
                <td className="p-2 text-xs">{card.limit}</td>
                <td className="p-2 text-xs">
                  {card.name.includes('Sapphire') ? '✅ Priority Pass' : 
                   card.name.includes('Platinum') ? '✅ Centurion' : '❌'}
                </td>
                <td className="p-2 text-xs">{card.closedDate || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Export Button */}
      <div className="mt-6 text-center">
        <button
          onClick={exportToCSV}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors inline-flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          Export to Spreadsheet
        </button>
      </div>
    </div>
  )

  const renderBenefits = () => (
    <div className="p-5 bg-gray-50">
      <h2 className="text-2xl font-bold mb-5 text-center text-blue-800">
        🎁 Monthly Benefits Tracker (August 2025 - August 2026)
      </h2>
      
      {Object.entries(monthlyBenefits).map(([month, benefits]) => (
        <div key={month} className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-gray-700 border-b-2 border-indigo-600 pb-2">
            {month}
          </h3>
          {benefits.map((benefit) => (
            <div key={benefit.id} className={`
              ${benefitsChecked[benefit.id] ? 'bg-green-50' : 'bg-white'} 
              p-4 mb-2 rounded-lg border 
              ${benefitsChecked[benefit.id] ? 'border-green-300' : 'border-gray-200'}
              flex items-start gap-3
            `}>
              <input
                type="checkbox"
                checked={benefitsChecked[benefit.id] || false}
                onChange={() => handleBenefitCheck(benefit.id)}
                className="w-5 h-5 mt-0.5 accent-green-600"
              />
              <div className="flex-1">
                <p className="text-sm font-bold mb-1 text-gray-800">
                  {benefit.benefit}
                </p>
                <p className="text-xs text-gray-600">
                  Card: {benefit.card}
                </p>
                <p className="text-xs text-gray-600">
                  Person: {benefit.person}
                </p>
              </div>
              {benefitsChecked[benefit.id] && (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )

  const renderSpending = () => (
    <div className="p-5 bg-gray-50">
      <h2 className="text-2xl font-bold mb-5 text-center text-blue-800">
        💳 Spending Optimizer
      </h2>
      
      {Object.entries(spendingCategories).map(([category, info]) => (
        <div key={category} className="bg-white p-5 mb-4 rounded-xl border border-gray-200 shadow-md">
          <h3 className="text-lg font-bold mb-2 text-gray-700">
            {category}
          </h3>
          <div className="bg-blue-50 p-3 rounded-lg mb-2">
            <p className="text-sm font-bold text-blue-700">
              Recommended: {info.recommended}
            </p>
            <p className="text-sm text-blue-700">
              Rate: {info.rate}
            </p>
          </div>
          <p className="text-xs text-gray-600">
            {info.details}
          </p>
        </div>
      ))}
    </div>
  )

  const renderLoyalty = () => (
    <div className="p-5 bg-gray-50">
      <h2 className="text-2xl font-bold mb-5 text-center text-blue-800">
        🏆 Loyalty Numbers Manager
      </h2>
      
      {/* Edit Mode Toggle */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative flex-1 mr-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search loyalty programs..."
            value={loyaltySearch}
            onChange={(e) => setLoyaltySearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setLoyaltyEditMode(!loyaltyEditMode)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            loyaltyEditMode 
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {loyaltyEditMode ? 'Save Changes' : 'Edit Mode'}
        </button>
      </div>

      {/* Known Traveler Numbers */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-700">Known Traveler Numbers</h3>
          {loyaltyEditMode && (
            <button
              onClick={() => addLoyaltyNumber('knownTraveler')}
              className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 inline-flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {getFilteredLoyaltyNumbers('knownTraveler').map(item => (
            <div key={item.id} className="bg-white p-3 rounded-lg border border-gray-200">
              {loyaltyEditMode ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Name"
                    value={item.name}
                    onChange={(e) => updateLoyaltyNumber('knownTraveler', item.id, 'name', e.target.value)}
                    className="flex-1 px-2 py-1 border rounded text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Number"
                    value={item.number}
                    onChange={(e) => updateLoyaltyNumber('knownTraveler', item.id, 'number', e.target.value)}
                    className="flex-1 px-2 py-1 border rounded text-sm font-mono"
                  />
                  <button
                    onClick={() => deleteLoyaltyNumber('knownTraveler', item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm">{item.name}</span>
                  <span className="text-sm font-mono text-gray-600">{item.number}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Airlines - Grouped by Airline */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-700">Airline Programs</h3>
          {loyaltyEditMode && (
            <button
              onClick={() => addLoyaltyNumber('airlines')}
              className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 inline-flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          )}
        </div>
        
        {Object.entries(getGroupedAirlines()).map(([subcategory, airlines]) => (
          <div key={subcategory} className="mb-6">
            <h4 className="text-lg font-semibold text-gray-600 mb-2">{subcategory}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {airlines.map(item => (
                <div key={item.id} className="bg-white p-3 rounded-lg border border-gray-200">
                  {loyaltyEditMode ? (
                    <div className="flex items-start gap-2">
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          placeholder="Name"
                          value={item.name}
                          onChange={(e) => updateLoyaltyNumber('airlines', item.id, 'name', e.target.value)}
                          className="w-full px-2 py-1 border rounded text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Number"
                          value={item.number}
                          onChange={(e) => updateLoyaltyNumber('airlines', item.id, 'number', e.target.value)}
                          className="w-full px-2 py-1 border rounded text-sm font-mono"
                        />
                        <input
                          type="text"
                          placeholder="Airline"
                          value={item.category}
                          onChange={(e) => updateLoyaltyNumber('airlines', item.id, 'category', e.target.value)}
                          className="w-full px-2 py-1 border rounded text-sm"
                        />
                      </div>
                      <button
                        onClick={() => deleteLoyaltyNumber('airlines', item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-sm">{item.name} - {item.category}</p>
                          <p className="text-sm font-mono text-gray-600">{item.number}</p>
                        </div>
                        {item.points && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-semibold">
                            {item.points} pts
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Hotels */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-700">Hotel Programs</h3>
          {loyaltyEditMode && (
            <button
              onClick={() => addLoyaltyNumber('hotels')}
              className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 inline-flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {getFilteredLoyaltyNumbers('hotels').map(item => (
            <div key={item.id} className="bg-white p-3 rounded-lg border border-gray-200">
              {loyaltyEditMode ? (
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Hotel Program"
                      value={item.category}
                      onChange={(e) => updateLoyaltyNumber('hotels', item.id, 'category', e.target.value)}
                      className="w-full px-2 py-1 border rounded text-sm mb-2"
                    />
                    <input
                      type="text"
                      placeholder="Number"
                      value={item.number}
                      onChange={(e) => updateLoyaltyNumber('hotels', item.id, 'number', e.target.value)}
                      className="w-full px-2 py-1 border rounded text-sm font-mono"
                    />
                  </div>
                  <button
                    onClick={() => deleteLoyaltyNumber('hotels', item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-sm">{item.category}</p>
                    <p className="text-sm font-mono text-gray-600">{item.number}</p>
                    {/* Display points based on the points tab data */}
                    {item.category === 'Marriott' && (
                      <p className="text-xs text-green-600 font-semibold mt-1">6,607 points</p>
                    )}
                    {item.category === 'Hilton' && (
                      <p className="text-xs text-green-600 font-semibold mt-1">6,116 points</p>
                    )}
                    {item.category === 'IHG' && (
                      <p className="text-xs text-green-600 font-semibold mt-1">1,973 points</p>
                    )}
                    {item.category === 'Hyatt' && (
                      <p className="text-xs text-green-600 font-semibold mt-1">10,028 points</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Other Programs */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-700">Other Programs</h3>
          {loyaltyEditMode && (
            <button
              onClick={() => addLoyaltyNumber('other')}
              className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 inline-flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {getFilteredLoyaltyNumbers('other').map(item => (
            <div key={item.id} className="bg-white p-3 rounded-lg border border-gray-200">
              {loyaltyEditMode ? (
                <div className="flex items-center gap-2">
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      placeholder="Program"
                      value={item.category}
                      onChange={(e) => updateLoyaltyNumber('other', item.id, 'category', e.target.value)}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Number"
                      value={item.number}
                      onChange={(e) => updateLoyaltyNumber('other', item.id, 'number', e.target.value)}
                      className="w-full px-2 py-1 border rounded text-sm font-mono"
                    />
                    <input
                      type="text"
                      placeholder="Points (optional)"
                      value={item.points || ''}
                      onChange={(e) => updateLoyaltyNumber('other', item.id, 'points', e.target.value)}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </div>
                  <button
                    onClick={() => deleteLoyaltyNumber('other', item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm">{item.category}</p>
                    <p className="text-sm font-mono text-gray-600">{item.number}</p>
                  </div>
                  {item.points && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-semibold">
                      {item.points} pts
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderReferrals = () => (
    <div className="p-5 bg-gray-50">
      <h2 className="text-2xl font-bold mb-5 text-center text-blue-800">
        🔗 Referral Link Manager
      </h2>
      
      <div className="mb-4">
        <button
          onClick={addReferralLink}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 inline-flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Referral Link
        </button>
      </div>

      <div className="space-y-4">
        {referralLinks.map(link => (
          <div key={link.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Card Name"
                value={link.card}
                onChange={(e) => updateReferralLink(link.id, 'card', e.target.value)}
                className="px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Referral Bonus"
                value={link.bonus}
                onChange={(e) => updateReferralLink(link.id, 'bonus', e.target.value)}
                className="px-3 py-2 border rounded-lg"
              />
              <input
                type="url"
                placeholder="Referral Link"
                value={link.link}
                onChange={(e) => updateReferralLink(link.id, 'link', e.target.value)}
                className="px-3 py-2 border rounded-lg md:col-span-2"
              />
              <input
                type="date"
                placeholder="Expiry Date"
                value={link.expiry}
                onChange={(e) => updateReferralLink(link.id, 'expiry', e.target.value)}
                className="px-3 py-2 border rounded-lg"
              />
              <div className="flex items-center gap-2">
                {link.link && (
                  <button
                    onClick={() => navigator.clipboard.writeText(link.link)}
                    className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Copy Link
                  </button>
                )}
                <button
                  onClick={() => deleteReferralLink(link.id)}
                  className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {referralLinks.length === 0 && (
        <div className="bg-gray-100 p-8 rounded-xl text-center">
          <p className="text-gray-600">No referral links added yet. Click "Add Referral Link" to get started!</p>
        </div>
      )}
    </div>
  )

  const renderPoints = () => (
    <div className="p-5 bg-gray-50">
      <h2 className="text-2xl font-bold mb-5 text-center text-blue-800">
        💰 Points & Miles Tracker
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded-xl text-center">
          <h3 className="text-sm text-blue-700 mb-2">Credit Card Points</h3>
          <p className="text-2xl font-bold text-blue-900">1,051,116</p>
        </div>
        <div className="bg-red-100 p-4 rounded-xl text-center">
          <h3 className="text-sm text-red-700 mb-2">Airline Miles</h3>
          <p className="text-2xl font-bold text-red-900">60,175</p>
        </div>
        <div className="bg-orange-100 p-4 rounded-xl text-center">
          <h3 className="text-sm text-orange-700 mb-2">Hotel Points</h3>
          <p className="text-2xl font-bold text-orange-900">24,724</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-xl text-center">
          <h3 className="text-sm text-purple-700 mb-2">Other Points</h3>
          <p className="text-2xl font-bold text-purple-900">622</p>
        </div>
      </div>

      {/* Detailed Points */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-bold text-gray-800">Update Balances</h3>
          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              editMode 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {editMode ? 'Save Changes' : 'Edit Mode'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(pointsBalances).map(([program, balance]) => (
            <div key={program} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-gray-800">{program}</h4>
                {editMode ? (
                  <input
                    type="number"
                    value={balance}
                    onChange={(e) => handlePointsUpdate(program, e.target.value)}
                    className="w-32 px-3 py-1 border rounded-md text-right font-semibold"
                  />
                ) : (
                  <span className="text-xl font-bold text-indigo-600">
                    {balance.toLocaleString()}
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500">
                Est. value: ${(balance * 0.02).toFixed(0)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const tabs = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'benefits', label: '🎁 Benefits' },
    { id: 'spending', label: '💳 Spending' },
    { id: 'loyalty', label: '🏆 Loyalty' },
    { id: 'referrals', label: '🔗 Referrals' },
    { id: 'points', label: '💰 Points' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white p-5 text-center sticky top-0 z-50">
        <h1 className="text-3xl font-bold m-0">
          Jack & Marissa Credit Card Tracker
        </h1>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 overflow-x-auto sticky top-16 z-40">
        <div className="flex min-w-max p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 mx-1 rounded-t-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-140px)]">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'benefits' && renderBenefits()}
        {activeTab === 'spending' && renderSpending()}
        {activeTab === 'loyalty' && renderLoyalty()}
        {activeTab === 'referrals' && renderReferrals()}
        {activeTab === 'points' && renderPoints()}
      </main>
    </div>
  )
}

export default App