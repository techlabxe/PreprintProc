FROM node:12-slim

RUN mkdir /work
WORKDIR /work

RUN apt update
RUN apt install -y tzdata && cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime
RUN apt install -y poppler-utils curl gnupg ghostscript
RUN npm install pdf-lib @pdf-lib/fontkit

COPY ./add_nombre.js /work
COPY ./make_ebook.js /work
COPY ./action.sh /bin/action.sh
RUN chmod +x /bin/action.sh


RUN mkdir -p /doc

VOLUME ["/doc" ]

ENTRYPOINT [ "/bin/action.sh" ]
CMD [ "submission", "input.pdf" "output.pdf" ]
# CMD ["ebook", "front.png", "body.pdf", "back.png", "output.pdf"]