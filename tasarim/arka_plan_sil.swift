// ============================================================
// FAS TUR — görselin arka planını YERELDE, KREDİSİZ siler (Apple Vision konu ayırma). SADECE macOS 14+.
// Kullanım:   swift tasarim/arka_plan_sil.swift  girdi.jpg  cikti.png  [daralt=1] [yumusat=1.2]
// Çıktı: şeffaf PNG (konu kalır, arka plan gider). daralt: maskeyi kaç piksel daraltır (krem saçak kalırsa 2 yapın).
// Windows'ta ÇALIŞMAZ: alternatifler -> Codex'ten "şeffaf PNG (arka plan silinmiş)" istemek ya da Higgsfield yeşil ekran (VIDEO-SARTNAMESI.md).
// ============================================================
import Foundation
import Vision
import CoreImage
import CoreImage.CIFilterBuiltins
import ImageIO
import UniformTypeIdentifiers

let a = CommandLine.arguments
guard a.count >= 3 else { print("Kullanım: swift arka_plan_sil.swift girdi.jpg cikti.png [daralt=1] [yumusat=1.2]"); exit(1) }
let girdi = URL(fileURLWithPath: a[1]), cikti = URL(fileURLWithPath: a[2])
let daralt = a.count > 3 ? Double(a[3]) ?? 1 : 1
let yumusat = a.count > 4 ? Double(a[4]) ?? 1.2 : 1.2
guard let src = CIImage(contentsOf: girdi) else { print("Görsel açılamadı"); exit(1) }
let handler = VNImageRequestHandler(ciImage: src, options: [:])
let req = VNGenerateForegroundInstanceMaskRequest()
try handler.perform([req])
guard let sonuc = req.results?.first else { print("Konu bulunamadı"); exit(2) }
let maskBuf = try sonuc.generateScaledMaskForImage(forInstances: sonuc.allInstances, from: handler)
var mask = CIImage(cvPixelBuffer: maskBuf)
// maskeyi daralt (erode) + hafif bulanıklaştır (feather)
if daralt > 0 { let f = CIFilter.morphologyMinimum(); f.inputImage = mask; f.radius = Float(daralt); mask = f.outputImage ?? mask }
if yumusat > 0 { let b = CIFilter.gaussianBlur(); b.inputImage = mask; b.radius = Float(yumusat); mask = (b.outputImage ?? mask).cropped(to: src.extent) }
let bos = CIImage(color: .clear).cropped(to: src.extent)
let blend = CIFilter.blendWithMask(); blend.inputImage = src; blend.backgroundImage = bos; blend.maskImage = mask
let out = blend.outputImage!
let ctx = CIContext()
let cs = CGColorSpace(name: CGColorSpace.sRGB)!
try ctx.writePNGRepresentation(of: out, to: cikti, format: .RGBA8, colorSpace: cs)
print("Tamam: \(cikti.path)")
