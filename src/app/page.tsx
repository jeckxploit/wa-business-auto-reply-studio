'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  MessageSquare, 
  Copy, 
  Save, 
  Trash2, 
  Sparkles, 
  Zap,
  BarChart3,
  ExternalLink,
  CheckCircle2,
  Sun,
  Moon,
  Download,
  Folder,
  TrendingUp
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useTemplateStore } from '@/stores/template-store'

// Animated number component
function AnimatedNumber({ value, duration = 1000 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0)
  
  useEffect(() => {
    let startTimestamp: number
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      setDisplayValue(Math.floor(progress * value))
      if (progress < 1) {
        window.requestAnimationFrame(step)
      }
    }
    window.requestAnimationFrame(step)
  }, [value, duration])
  
  return <span>{displayValue}</span>
}

// Format date function
function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

export default function WAStudioPage() {
  const { toast } = useToast()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [generatedCount, setGeneratedCount] = useState(0)
  
  const [formData, setFormData] = useState({
    customerName: '',
    businessName: '',
    operationalHours: '',
    status: 'open' as 'open' | 'closed',
    tone: 'formal' as 'formal' | 'semi-formal' | 'casual',
    category: 'open' as 'open' | 'closed' | 'promo' | 'confirmation' | 'reminder',
  })
  const [generatedContent, setGeneratedContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { templates, fetchTemplates, addTemplate, deleteTemplate } = useTemplateStore()

  // Calculate most used category
  const mostUsedCategory = useMemo(() => {
    if (templates.length === 0) return 'N/A'
    const categoryCount: Record<string, number> = {}
    templates.forEach((t: any) => {
      categoryCount[t.category] = (categoryCount[t.category] || 0) + 1
    })
    const sorted = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])
    return sorted[0][0]
  }, [templates])

  // Initialize dark mode from localStorage and system preference
  useEffect(() => {
    setIsMounted(true)
    const savedTheme = localStorage.getItem('darkMode')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldBeDark = savedTheme === 'true' || (!savedTheme && prefersDark)
    setIsDarkMode(shouldBeDark)
    document.documentElement.classList.toggle('dark', shouldBeDark)
  }, [])

  // Fetch templates on mount
  useEffect(() => {
    if (isMounted) {
      fetchTemplates()
    }
  }, [isMounted, fetchTemplates])

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    localStorage.setItem('darkMode', newMode.toString())
    document.documentElement.classList.toggle('dark', newMode)
  }

  const handleGenerate = async () => {
    if (!formData.businessName) {
      toast({
        title: 'Error Validasi',
        description: 'Nama bisnis wajib diisi',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/templates/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to generate template')

      const data = await response.json()
      setGeneratedContent(data.content)
      setGeneratedCount(prev => prev + 1)
      toast({
        title: 'Berhasil',
        description: 'Template berhasil dibuat',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal membuat template',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!generatedContent) {
      toast({
        title: 'Error',
        description: 'Buat template terlebih dahulu',
        variant: 'destructive',
      })
      return
    }

    try {
      await navigator.clipboard.writeText(generatedContent)
      toast({
        title: 'Disalin!',
        description: 'Template berhasil disalin',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal menyalin',
        variant: 'destructive',
      })
    }
  }

  const handleSave = async () => {
    if (!generatedContent) {
      toast({
        title: 'Error',
        description: 'Buat template terlebih dahulu',
        variant: 'destructive',
      })
      return
    }

    try {
      console.log('📝 Saving template:', {
        businessName: formData.businessName,
        category: formData.category,
        tone: formData.tone,
        contentLength: generatedContent.length,
      })

      await addTemplate({
        ...formData,
        content: generatedContent,
      })

      console.log('✅ Template saved successfully')
      toast({
        title: 'Tersimpan!',
        description: 'Template berhasil disimpan',
      })
    } catch (error) {
      console.error('❌ Save template error:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        formData: {
          businessName: formData.businessName,
          category: formData.category,
          tone: formData.tone,
        },
        contentLength: generatedContent.length,
      })

      const errorMessage = error instanceof Error
        ? error.message
        : 'Gagal menyimpan template. Silakan coba lagi.'

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteTemplate(id)
      toast({
        title: 'Terhapus',
        description: 'Template berhasil dihapus',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal menghapus template',
        variant: 'destructive',
      })
    }
  }

  const handleLoadTemplate = (template: any) => {
    setFormData({
      customerName: template.customerName || '',
      businessName: template.businessName || '',
      operationalHours: template.operationalHours || '',
      status: template.status as 'open' | 'closed',
      tone: template.tone as 'formal' | 'semi-formal' | 'casual',
      category: template.category as any,
    })
    setGeneratedContent(template.content)
    toast({
      title: 'Dimuat',
      description: 'Template berhasil dimuat',
    })
  }

  const getWhatsAppLink = () => {
    if (!generatedContent) return '#'
    const encodedText = encodeURIComponent(generatedContent)
    return `https://wa.me/?text=${encodedText}`
  }

  const handleOpenWhatsApp = () => {
    if (!generatedContent) {
      toast({
        title: 'Error',
        description: 'Buat template terlebih dahulu',
        variant: 'destructive',
      })
      return
    }
    window.open(getWhatsAppLink(), '_blank')
  }

  const handleCopyWhatsAppLink = async () => {
    if (!generatedContent) {
      toast({
        title: 'Error',
        description: 'Buat template terlebih dahulu',
        variant: 'destructive',
      })
      return
    }

    try {
      await navigator.clipboard.writeText(getWhatsAppLink())
      toast({
        title: 'Disalin!',
        description: 'Link WhatsApp berhasil disalin',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal menyalin link',
        variant: 'destructive',
      })
    }
  }

  const handleExportAsTxt = () => {
    if (!generatedContent) {
      toast({
        title: 'Error',
        description: 'Buat template terlebih dahulu',
        variant: 'destructive',
      })
      return
    }

    const textToExport = `
Auto Reply Studio
===============================

Nama Bisnis: ${formData.businessName || 'N/A'}
Kategori: ${formData.category}
Nada: ${formData.tone}
Status: ${formData.status}

Template yang Dibuat:
-------------------
${generatedContent}

Dibuat oleh Auto Reply Studio
`.trim()

    const blob = new Blob([textToExport], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `wa-template-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: 'Diekspor!',
      description: 'Template berhasil diekspor sebagai file .txt',
    })
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 relative ${isDarkMode ? 'dark bg-slate-950' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
      {/* Subtle radial gradient glow */}
      <div 
        className="fixed inset-0 pointer-events-none -z-10"
        style={{
          background: `radial-gradient(
            circle at top,
            ${isDarkMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.08)'},
            transparent 60%
          )`
        }}
      />
      
      {/* Subtle background pattern for dark mode */}
      {isDarkMode && (
        <div className="fixed inset-0 opacity-[0.02] pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }} />
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60">
        <div className="container mx-auto px-3 sm:px-6 max-w-6xl">
          <div className="flex h-16 items-center justify-between">
            {/* Logo & Title - Responsive with proper text wrapping */}
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="p-2 sm:p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-xl shadow-lg shadow-blue-500/20 dark:shadow-blue-600/20 flex-shrink-0">
                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-sm sm:text-base md:text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent leading-tight truncate">
                  Auto Reply Studio
                </h1>
                <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 truncate leading-tight">
                  Generator Pesan Profesional
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ml-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const savedSection = document.getElementById('saved-templates')
                  savedSection?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="hidden sm:flex items-center gap-2 transition-all duration-200 hover:scale-105"
              >
                <Folder className="h-4 w-4" />
                Lihat Tersimpan
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  const formSection = document.getElementById('template-form')
                  formSection?.scrollIntoView({ behavior: 'smooth' })
                  setTimeout(() => handleGenerate(), 300)
                }}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:scale-105 hover:shadow-xl"
              >
                <Sparkles className="h-4 w-4 mr-1.5" />
                <span className="hidden sm:inline">Buat Template</span>
                <span className="sm:hidden">Buat</span>
              </Button>
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="transition-all duration-200 hover:scale-110 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-6 py-6 sm:py-10 max-w-6xl flex-1">
        {/* Mini Dashboard Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Card className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/20 hover:scale-[1.02] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-white/50 dark:bg-slate-900/50 backdrop-blur">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                    Template Dibuat
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    <AnimatedNumber value={generatedCount} />
                  </p>
                </div>
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/20 hover:scale-[1.02] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-white/50 dark:bg-slate-900/50 backdrop-blur">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg shadow-emerald-500/20">
                  <Folder className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                    Template Tersimpan
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    <AnimatedNumber value={templates.length} />
                  </p>
                </div>
                <BarChart3 className="h-5 w-5 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/20 hover:scale-[1.02] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-white/50 dark:bg-slate-900/50 backdrop-blur">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl shadow-lg shadow-violet-500/20">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                    Kategori Paling Sering
                  </p>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100 capitalize">
                    {mostUsedCategory}
                  </p>
                </div>
                <TrendingUp className="h-5 w-5 text-violet-500" />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Form Section */}
          <Card id="template-form" className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Buat Template Anda
              </CardTitle>
              <CardDescription className="text-base text-slate-600 dark:text-slate-400">
                Isi detail bisnis Anda dan sesuaikan respons
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="customer-name" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Nama Pelanggan
                </Label>
                <Input
                  id="customer-name"
                  placeholder="mis. Budi"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="rounded-xl border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 transition-all duration-200 focus:scale-[1.01] bg-white dark:bg-slate-800"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="business-name" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Nama Bisnis <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="business-name"
                  placeholder="mis. Cafe Delight"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  required
                  className="rounded-xl border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 transition-all duration-200 focus:scale-[1.01] bg-white dark:bg-slate-800"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="operational-hours" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Jam Operasional
                </Label>
                <Input
                  id="operational-hours"
                  placeholder="mis. 9PAGI-5SORE"
                  value={formData.operationalHours}
                  onChange={(e) => setFormData({ ...formData, operationalHours: e.target.value })}
                  className="rounded-xl border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 transition-all duration-200 focus:scale-[1.01] bg-white dark:bg-slate-800"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Status
                </Label>
                <RadioGroup
                  value={formData.status}
                  onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                  className="grid grid-cols-2 gap-3"
                >
                  <div className="flex items-center space-x-2 p-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all duration-200 cursor-pointer">
                    <RadioGroupItem value="open" id="open" className="border-slate-400" />
                    <Label htmlFor="open" className="font-normal cursor-pointer text-sm">Buka</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all duration-200 cursor-pointer">
                    <RadioGroupItem value="closed" id="closed" className="border-slate-400" />
                    <Label htmlFor="closed" className="font-normal cursor-pointer text-sm">Tutup</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Nada
                </Label>
                <RadioGroup
                  value={formData.tone}
                  onValueChange={(value: any) => setFormData({ ...formData, tone: value })}
                  className="grid grid-cols-1 gap-3"
                >
                  <div className="flex items-center space-x-2 p-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all duration-200 cursor-pointer">
                    <RadioGroupItem value="formal" id="formal" className="border-slate-400" />
                    <Label htmlFor="formal" className="font-normal cursor-pointer text-sm">Formal</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all duration-200 cursor-pointer">
                    <RadioGroupItem value="semi-formal" id="semi-formal" className="border-slate-400" />
                    <Label htmlFor="semi-formal" className="font-normal cursor-pointer text-sm">Semi Formal</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all duration-200 cursor-pointer">
                    <RadioGroupItem value="casual" id="casual" className="border-slate-400" />
                    <Label htmlFor="casual" className="font-normal cursor-pointer text-sm">Santai</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="template-category" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Kategori Template
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: any) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger id="template-category" className="rounded-xl border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 transition-all duration-200 focus:scale-[1.01] bg-white dark:bg-slate-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                    <SelectItem value="open">Bisnis Buka</SelectItem>
                    <SelectItem value="closed">Bisnis Tutup</SelectItem>
                    <SelectItem value="promo">Promosi</SelectItem>
                    <SelectItem value="confirmation">Konfirmasi Pesanan</SelectItem>
                    <SelectItem value="reminder">Pengingat Pembayaran</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full rounded-xl text-base h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Membuat...
                  </span>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Buat Template
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Preview & Templates Section */}
          <div className="space-y-6">
            {/* Live Preview */}
            <Card className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Pratinjau Langsung
                </CardTitle>
                <CardDescription className="text-base text-slate-600 dark:text-slate-400">
                  Lihat template Anda secara real-time
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="min-h-[160px] rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/50 p-4 whitespace-pre-wrap transition-all duration-300 animate-in fade-in font-mono text-sm leading-relaxed">
                  {generatedContent || (
                    <span className="text-slate-400 dark:text-slate-600 italic">
                      Template Anda akan muncul di sini...
                    </span>
                  )}
                </div>
                
                {/* Character Counter */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Jumlah Karakter
                  </span>
                  <span className={`font-bold ${generatedContent.length > 1000 ? 'text-red-500' : 'text-blue-500'}`}>
                    {generatedContent.length} / 1000
                  </span>
                </div>

                {/* WhatsApp Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    className="rounded-xl border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 hover:scale-[1.02]"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Salin
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:scale-[1.02]"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Simpan
                  </Button>
                  <Button
                    onClick={handleOpenWhatsApp}
                    className="rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg shadow-green-500/20 transition-all duration-200 hover:scale-[1.02] col-span-2"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Buka di WhatsApp
                  </Button>
                </div>

                {/* Secondary Actions */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button
                    onClick={handleCopyWhatsAppLink}
                    variant="ghost"
                    className="rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 hover:scale-[1.02]"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Salin Link
                  </Button>
                  <Button
                    onClick={handleExportAsTxt}
                    variant="ghost"
                    className="rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 hover:scale-[1.02]"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Ekspor .txt
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Saved Templates */}
            <Card id="saved-templates" className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Template Tersimpan
                </CardTitle>
                <CardDescription className="text-base text-slate-600 dark:text-slate-400">
                  Kelola template yang tersimpan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[320px] pr-4">
                  {templates.length === 0 ? (
                    <div className="text-center py-12">
                      <Folder className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
                      <p className="text-sm text-slate-500 dark:text-slate-500">
                        Belum ada template tersimpan
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {templates.map((template: any) => (
                        <div
                          key={template.id}
                          onClick={() => handleLoadTemplate(template)}
                          className="group flex items-start justify-between gap-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950/50 p-4 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-200 hover:scale-[1.01] cursor-pointer"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                {template.category}
                              </Badge>
                              <Badge variant="outline" className="text-xs border-slate-300 dark:border-slate-700">
                                {template.tone}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-1">
                              {template.content}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500">
                              <span>{template.businessName || 'Tidak ada nama bisnis'}</span>
                              <span>•</span>
                              <span>Dibuat • {formatDate(template.createdAt)}</span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(template.id)
                            }}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100 flex-shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Security Badge Section */}
      <section className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur py-8">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-4">
            <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
              🔒 Keamanan & Jaminan Kualitas
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm text-slate-700 dark:text-slate-300 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
              <span>Sanitasi Input</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-slate-700 dark:text-slate-300 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
              <span>Pencegahan XSS</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-slate-700 dark:text-slate-300 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
              <span>Validasi Server</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-slate-700 dark:text-slate-300 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
              <span>Query Aman</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-6">
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
            Auto Reply Studio <span className="text-slate-400 dark:text-slate-600 font-normal">v1.0.0</span>
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
            © 2026 Kholid Azaki. Hak cipta dilindungi.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-500">
            Dibuat dengan Next.js 16 + Prisma ORM + shadcn/ui
          </p>
        </div>
      </footer>
    </div>
  )
}
