Rem FAS TUR kur guncelleme: kur_yerel.bat dosyasini pencere acmadan calistirir.
Set f = CreateObject("Scripting.FileSystemObject")
CreateObject("WScript.Shell").Run """" & f.GetParentFolderName(WScript.ScriptFullName) & "\kur_yerel.bat""", 0, True
