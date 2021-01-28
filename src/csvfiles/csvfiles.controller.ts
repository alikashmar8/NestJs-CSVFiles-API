import { Controller, Delete, Get, Param, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';
import { CsvfilesService } from './csvfiles.service';

@Controller('csv_files')
export class CsvfilesController {
    constructor(
        private csvfilesService: CsvfilesService
    ){}
    
    @Get()
    @UseGuards(new AuthGuard())
    findAllCurrentUserFiles(@Req() req){
        return this.csvfilesService.findCurrentUserFiles(req.token.user);
    }

    @Get(':id')
    @UseGuards(new AuthGuard())
    findById(@Param('id') id, @Req() req){
        return this.csvfilesService.findById(id, req.token.user);
    }

    @Delete(':id')
    @UseGuards(new AuthGuard())
    delete(@Param() param, @Req() req){
        return this.csvfilesService.delete(param.id, req.token.user);
    }

    @Post('store')
    @UseGuards(new AuthGuard())
    @UseInterceptors(FileInterceptor('csvFile'))
    create(@UploadedFile() csvFile,@Req() req, @Res() res){
        return this.csvfilesService.create(csvFile, req.token.user, res);
    }

}
