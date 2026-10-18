<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('project_media', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')
                ->constrained('projects')
                ->onDelete('cascade');
            $table->foreignId('media_id')
                ->constrained('media')
                ->onDelete('restrict');
            $table->enum('kind', ['desktop', 'mobile', 'video', 'other'])->default('desktop');
            $table->string('caption', 200)->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['project_id', 'sort_order']);
            $table->index('media_id');
            $table->unique(['project_id', 'media_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_media');
    }
};
