import sys
from pdf2docx import Converter

if len(sys.argv) != 3:
    print("Usage: pdf_to_docx.py input.pdf output.docx", file=sys.stderr)
    sys.exit(1)

input_pdf = sys.argv[1]
output_docx = sys.argv[2]

cv = Converter(input_pdf)
cv.convert(output_docx)
cv.close()
