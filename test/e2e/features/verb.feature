Feature: Frictionless PDF Verbs

  Background:
    Given I have a new browser context

  @pdf-to-ppt
  Scenario: PDF Converter - PDF to PPT
    Given I go to the pdf-to-ppt page
     Then I upload the PDF "test-files/test.pdf"
     Then I download the converted file

  @pdf-to-word
  Scenario: PDF Converter - PDF to Word
    Given I go to the pdf-to-word page
     Then I upload the PDF "test-files/test.pdf"
     Then I download the converted file

  @pdf-to-excel
  Scenario: PDF Converter - PDF to Excel
    Given I go to the pdf-to-excel page
     Then I upload the PDF "test-files/test.pdf"
     Then I download the converted file

  @pdf-to-png
  Scenario: PDF Converter - PDF to JPG
    Given I go to the pdf-to-jpg page
     Then I upload the PDF "test-files/test.pdf"
     Then I choose "PNG (*.png)" as the output format
     Then I download the converted file

  @pdf-to-jpg
  Scenario: PDF Converter - PDF to JPG
    Given I go to the pdf-to-jpg page
     Then I upload the PDF "test-files/test.pdf"
     Then I choose "JPG (*.jpg, *.jpeg)" as the output format
     Then I download the converted file

  @word-to-pdf
  Scenario: PDF Converter - Word to PDF
    Given I go to the word-to-pdf page
     Then I upload the file "test-files/test.docx"
     Then I download the converted file

  @jpg-to-pdf
  Scenario: PDF Converter - JPG to PDF
    Given I go to the jpg-to-pdf page
     Then I upload the file "test-files/test.jpg"
     Then I download the converted file

  @excel-to-pdf
  Scenario: PDF Converter - Excel to PDF
    Given I go to the excel-to-pdf page
     Then I upload the file "test-files/test.xlsx"
     Then I download the converted file

  @ppt-to-pdf
  Scenario: PDF Converter - Excel to PDF
    Given I go to the ppt-to-pdf page
     Then I upload the file "test-files/test.pptx"
     Then I download the converted file     